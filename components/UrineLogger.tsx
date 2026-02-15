"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Medication, UrineLog, UrineAchievement, UrineColorScale, UrineSmartFeedback, UrineHealthAlert, UrineAchievementDef } from "@/types";
import {
    URINE_COLORS,
    ACHIEVEMENT_DEFINITIONS,
    getXPForScale,
    getUrineCategory,
    getSmartFeedback,
    computeHealthAlerts,
    checkAchievements,
    getMedicationNotes,
    getFrequencyStatus,
    getAchievementXPBonus,
} from "@/utils/urineHelpers";
import UrineDetailModal from "./UrineDetailModal";

interface UrineLoggerProps {
    userId: string;
    onLog: (xpGained: number) => void;
    medications: Medication[];
    dailyHydration: number;
}

export default function UrineLogger({ userId, onLog, medications, dailyHydration }: UrineLoggerProps) {
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [todayLogs, setTodayLogs] = useState<UrineLog[]>([]);
    const [weeklyLogs, setWeeklyLogs] = useState<UrineLog[]>([]);
    const [achievements, setAchievements] = useState<UrineAchievement[]>([]);
    const [showDetail, setShowDetail] = useState(false);
    const [feedback, setFeedback] = useState<UrineSmartFeedback | null>(null);
    const [alerts, setAlerts] = useState<UrineHealthAlert[]>([]);
    const [newAchievement, setNewAchievement] = useState<UrineAchievementDef | null>(null);

    const hasDiuretics = medications.some(m =>
        ["furosemide", "hydrochlorothiazide", "diuretic", "lasix", "spironolactone"]
            .some(k => m.name.toLowerCase().includes(k))
    );

    // Fetch urine data on mount
    useEffect(() => {
        const fetchData = async () => {
            const today = new Date().toISOString().split("T")[0];
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

            const [todayRes, weekRes, achieveRes] = await Promise.all([
                supabase
                    .from("urine_logs")
                    .select("*")
                    .eq("user_id", userId)
                    .gte("created_at", `${today}T00:00:00`)
                    .lte("created_at", `${today}T23:59:59`)
                    .order("created_at", { ascending: true }),
                supabase
                    .from("urine_logs")
                    .select("*")
                    .eq("user_id", userId)
                    .gte("created_at", sevenDaysAgo.toISOString())
                    .order("created_at", { ascending: true }),
                supabase
                    .from("urine_achievements")
                    .select("*")
                    .eq("user_id", userId),
            ]);

            if (todayRes.data) setTodayLogs(todayRes.data as UrineLog[]);
            if (weekRes.data) setWeeklyLogs(weekRes.data as UrineLog[]);
            if (achieveRes.data) setAchievements(achieveRes.data as UrineAchievement[]);
        };

        fetchData();
    }, [userId]);

    // Compute alerts when data changes
    const recomputeAlerts = useCallback(() => {
        const newAlerts = computeHealthAlerts(todayLogs, weeklyLogs, dailyHydration, medications);
        setAlerts(newAlerts);
    }, [todayLogs, weeklyLogs, dailyHydration, medications]);

    useEffect(() => {
        recomputeAlerts();
    }, [recomputeAlerts]);

    const handleLog = async (scale: UrineColorScale) => {
        if (loading) return;
        setLoading(true);
        setSelectedColor(scale);

        const { data, error } = await supabase
            .from("urine_logs")
            .insert({ user_id: userId, color_scale: scale })
            .select()
            .single();

        if (!error && data) {
            const newLog = data as UrineLog;

            // Dynamic XP
            const xp = getXPForScale(scale);
            onLog(xp);

            // Optimistic update
            const updatedToday = [...todayLogs, newLog];
            const updatedWeekly = [...weeklyLogs, newLog];
            setTodayLogs(updatedToday);
            setWeeklyLogs(updatedWeekly);

            // Smart feedback
            const fb = getSmartFeedback(scale, updatedToday, updatedWeekly, new Date(), medications);
            setFeedback(fb);
            setTimeout(() => setFeedback(null), 4000);

            // Check achievements
            const newKeys = checkAchievements(updatedToday, updatedWeekly, achievements);
            for (const key of newKeys) {
                const { data: achData } = await supabase
                    .from("urine_achievements")
                    .insert({ user_id: userId, achievement_key: key })
                    .select()
                    .single();

                if (achData) {
                    const achRecord = achData as UrineAchievement;
                    setAchievements(prev => [...prev, achRecord]);

                    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.key === key);
                    if (def) {
                        onLog(getAchievementXPBonus(def.tier));
                        setNewAchievement(def);
                        setTimeout(() => setNewAchievement(null), 3000);
                    }
                }
            }

            setTimeout(() => setSelectedColor(null), 2000);
        }
        setLoading(false);
    };

    // Format last log time
    const lastLogTime = todayLogs.length > 0
        ? new Date(todayLogs[todayLogs.length - 1].created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : null;

    const freqStatus = getFrequencyStatus(todayLogs.length, hasDiuretics);
    const medNote = getMedicationNotes(medications);

    // Category badge for last selection
    const categoryInfo = selectedColor ? getUrineCategory(selectedColor as UrineColorScale) : null;

    return (
        <>
            <div className="dash-card urine-card">
                <div className="dash-card-header">
                    <h3 className="dash-card-title">PEE CHART</h3>
                    <button className="urine-expand-btn" onClick={() => setShowDetail(true)}>
                        DETAILS &#x25B6;
                    </button>
                </div>
                <div className="urine-widget">
                    <p className="urine-instruction">Log your color (up to +10 XP)</p>

                    {/* 8-point scale: 2 rows of 4 */}
                    <div className="urine-scale-grid">
                        {URINE_COLORS.map((c) => (
                            <button
                                key={c.scale}
                                onClick={() => handleLog(c.scale)}
                                disabled={loading}
                                className={`urine-drop urine-drop-small ${selectedColor === c.scale ? "selected" : ""}`}
                                style={{ backgroundColor: c.color }}
                                title={`${c.label} (+${c.xp} XP)`}
                            >
                                {selectedColor === c.scale && <span className="check-icon">&#x2713;</span>}
                            </button>
                        ))}
                    </div>

                    {/* Category badge after selection */}
                    {categoryInfo && selectedColor && (
                        <div className="urine-category-badge" style={{ background: categoryInfo.badgeColor }}>
                            {categoryInfo.label}
                        </div>
                    )}

                    {/* Quick status */}
                    <div className="urine-quick-status">
                        <span className={`urine-today-count ${freqStatus.status}`}>
                            {freqStatus.label} TODAY
                        </span>
                        {lastLogTime && (
                            <span className="urine-last-log">
                                Last: {lastLogTime}
                            </span>
                        )}
                    </div>

                    {/* Smart feedback */}
                    {feedback && (
                        <div className={`urine-feedback ${feedback.type}`}>
                            <span className="urine-feedback-text">
                                {feedback.icon} {feedback.message}
                            </span>
                        </div>
                    )}

                    {/* Medication note */}
                    {medNote && !feedback && (
                        <div className="urine-med-note">
                            &#x1F48A; {medNote}
                        </div>
                    )}
                </div>
            </div>

            {/* Achievement toast */}
            {newAchievement && (
                <div className="urine-toast">
                    <div className="urine-toast-title">
                        {newAchievement.icon} ACHIEVEMENT UNLOCKED!
                    </div>
                    <div className="urine-toast-desc">
                        {newAchievement.name} &mdash; {newAchievement.description}
                    </div>
                </div>
            )}

            {/* Detail modal */}
            {showDetail && (
                <UrineDetailModal
                    todayLogs={todayLogs}
                    weeklyLogs={weeklyLogs}
                    achievements={achievements}
                    medications={medications}
                    dailyHydration={dailyHydration}
                    alerts={alerts}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </>
    );
}
