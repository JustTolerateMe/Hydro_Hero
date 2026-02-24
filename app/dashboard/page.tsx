"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Sidebar from "@/components/Sidebar";
import UrineLogger from "@/components/UrineLogger";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/Shared";
import { Medication, WeeklyData, UrineAchievement, UrineAchievementDef } from "@/types";
import { getLevelFromXP } from "@/utils/helpers";
import { checkHydrationAchievements, ACHIEVEMENT_DEFINITIONS, getAchievementXPBonus } from "@/utils/urineHelpers";

export default function Dashboard() {
    const { user, profile, loading: authLoading, setProfile } = useAuth();
    const [dataLoading, setDataLoading] = useState(true);

    // Hydration State
    const [dailyHydration, setDailyHydration] = useState(0);
    const hydrationGoal = profile?.daily_water_goal_ml || 2000;

    // Medication State
    const [medications, setMedications] = useState<Medication[]>([]);

    // Chart Data
    const [weeklyData, setWeeklyData] = useState<WeeklyData>([]);

    // Achievement State
    const [achievements, setAchievements] = useState<UrineAchievement[]>([]);
    const [newAchievement, setNewAchievement] = useState<UrineAchievementDef | null>(null);

    // Derived State
    const allMedsTaken = medications.length > 0 && medications.every(m => m.taken);
    const kidneyMood = dailyHydration > 1500 ? "HAPPY" : "THIRSTY";
    const hydrationPercent = Math.round((dailyHydration / hydrationGoal) * 100);

    // Streak State
    const [streak, setStreak] = useState(0);

    // Fetch Dashboard Data
    useEffect(() => {
        if (authLoading || !user) return;

        const fetchDashboardData = async () => {
            const today = new Date().toISOString().split("T")[0];
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

            // Parallel Fetching
            const [hydroRes, weekRes, medsRes, medLogsRes, streakRes, achieveRes] = await Promise.all([
                supabase
                    .from("hydration_logs")
                    .select("amount_ml")
                    .eq("user_id", user.id)
                    .gte("created_at", `${today}T00:00:00`)
                    .lte("created_at", `${today}T23:59:59`),
                supabase
                    .from("hydration_logs")
                    .select("amount_ml, created_at")
                    .eq("user_id", user.id)
                    .gte("created_at", sevenDaysAgo.toISOString()),
                supabase
                    .from("medications")
                    .select("*")
                    .eq("user_id", user.id),
                supabase
                    .from("medication_logs")
                    .select("medication_id")
                    .eq("user_id", user.id)
                    .eq("taken_at_date", today),
                supabase.rpc("get_current_streak", { user_uuid: user.id }),
                supabase
                    .from("urine_achievements")
                    .select("*")
                    .eq("user_id", user.id)
            ]);

            // Process Hydration
            const totalHydro = hydroRes.data?.reduce((sum: number, log: any) => sum + log.amount_ml, 0) || 0;
            setDailyHydration(totalHydro);

            // Process Streak
            setStreak(streakRes.data || 0);

            // Process Weekly
            const processedWeek = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const daysLogs = weekRes.data?.filter((l: any) => l.created_at.startsWith(dateStr));
                const sum = daysLogs?.reduce((a: number, b: any) => a + b.amount_ml, 0) || 0;
                processedWeek.unshift({ date: dateStr.slice(5), amount: sum });
            }
            setWeeklyData(processedWeek);

            // Process Meds
            const takenMedIds = new Set(medLogsRes.data?.map((l: any) => l.medication_id));
            const medsWithStatus = medsRes.data?.map((m: any) => ({
                ...m,
                taken: takenMedIds.has(m.id)
            })) || [];
            medsWithStatus.sort((a: any, b: any) => a.schedule_time.localeCompare(b.schedule_time));
            setMedications(medsWithStatus);

            // Process Achievements
            if (achieveRes.data) setAchievements(achieveRes.data as UrineAchievement[]);

            setDataLoading(false);
        };

        fetchDashboardData();
    }, [user, authLoading]);

    // Achievement Utility for Child Components
    const onAchievementUnlocked = (newAch: UrineAchievement) => {
        setAchievements(prev => {
            if (prev.some(a => a.achievement_key === newAch.achievement_key)) return prev;
            return [...prev, newAch];
        });
    };

    // XP Logic
    const awardXP = async (amount: number) => {
        if (!user || !profile) return;

        const newXP = Math.max(0, (profile.xp || 0) + amount);
        setProfile({ ...profile, xp: newXP });

        await supabase
            .from("profiles")
            .update({ xp: newXP })
            .eq("id", user.id);
    };

    const addWater = async (amount: number) => {
        const nextHydration = Math.max(0, dailyHydration + amount);
        setDailyHydration(nextHydration);

        if (!user) return;
        await supabase.from("hydration_logs").insert({
            user_id: user.id,
            amount_ml: amount
        });

        awardXP(amount > 0 ? 10 : -10);

        // Check for Hydration Achievements
        const newKeys = checkHydrationAchievements(nextHydration, hydrationGoal, weeklyData, achievements);
        if (newKeys.length > 0) {
            const achievementPromises = newKeys.map(async (key) => {
                const { data: achData, error: achError } = await supabase
                    .from("urine_achievements")
                    .insert({ user_id: user.id, achievement_key: key })
                    .select()
                    .single();

                if (achError) {
                    console.error(`Failed to unlock hydration achievement ${key}:`, achError);
                    return null;
                }

                if (achData) {
                    const achRecord = achData as UrineAchievement;
                    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.key === key);
                    if (def) {
                        awardXP(getAchievementXPBonus(def.tier));
                        setNewAchievement(def);
                        setTimeout(() => setNewAchievement(null), 3000);
                    }
                    return achRecord;
                }
                return null;
            });

            const results = await Promise.all(achievementPromises);
            const successfulAch = results.filter((r): r is UrineAchievement => r !== null);
            if (successfulAch.length > 0) {
                setAchievements(prev => [...prev, ...successfulAch]);
            }
        }
    };

    const takeMedication = async (medId: number) => {
        setMedications(prev => prev.map(m => m.id === medId ? { ...m, taken: true } : m));
        if (!user) return;
        await supabase.from("medication_logs").insert({
            user_id: user.id,
            medication_id: medId,
            status: 'taken'
        });

        awardXP(50);
    };

    if (authLoading || dataLoading) {
        return <LoadingScreen />;
    }

    // Mission Alert Logic
    let showMissionAlert = false;
    let alertMedName = "";
    let alertDiffMins = 0;

    const nextMed = medications.find(m => !m.taken);
    if (nextMed) {
        const [hours, minutes] = nextMed.schedule_time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(hours, minutes, 0, 0);
        const nowTime = new Date();
        const diffMs = medTime.getTime() - nowTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60 && diffMins > -720) {
            showMissionAlert = true;
            alertMedName = nextMed.name;
            alertDiffMins = diffMins;
        }
    }

    const waterFillPercent = Math.min((dailyHydration / hydrationGoal) * 100, 100);
    const currentXP = profile?.xp || 0;
    const currentLevel = getLevelFromXP(currentXP);

    return (
        <div className="dash">
            <Sidebar user={user} profile={profile} />

            <div className="dash-main">
                {/* HEADER */}
                <div className="dash-header">
                    <h1 className="dash-header-title">TODAY&apos;S MISSION LOG</h1>
                    <div className="dash-header-right">
                        <div className="dash-streak-badge">&#x1F525; {streak} DAY STREAK! &bull; LVL {currentLevel}</div>
                        <button className="dash-notif-btn">&#x1F514;</button>
                    </div>
                </div>

                {/* MEDICATION ALERT */}
                {showMissionAlert && nextMed && (
                    <div className="dash-med-alert">
                        <div className="dash-med-alert-text">
                            <h3>MEDICATION ALERT!</h3>
                            <p>
                                Your <strong>{alertMedName}</strong> dose is {alertDiffMins <= 0 ? "due now!" : `due in ${alertDiffMins} minutes.`} Don&apos;t let the bacteria win!
                            </p>
                        </div>
                        <button className="dash-take-btn" onClick={() => takeMedication(nextMed.id)}>
                            TAKE NOW &#x26A1;
                        </button>
                    </div>
                )}

                {/* CONTENT GRID */}
                <div className="dash-content">
                    {/* TOP ROW: Tank + Pills */}
                    <div className="dash-row-top">
                        {/* HYDRATION TANK */}
                        <div className="dash-card hydration-tank">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">HYDRATION TANK</h3>
                                <span className="hydration-good-badge">
                                    {hydrationPercent >= 50 ? 'GOOD' : 'LOW'}
                                </span>
                            </div>
                            <div className="hydration-body">
                                <div
                                    className="hydration-water-bg"
                                    style={{ height: `${waterFillPercent}%` }}
                                />
                                <div className="hydration-percent">{hydrationPercent}%</div>
                                <div className="hydration-amount">
                                    {dailyHydration} / {hydrationGoal} ml
                                </div>
                                <div className="hydration-moon">&#x1F319;</div>
                            </div>
                            <div className="hydration-actions">
                                <button className="hydration-add-btn subtract" onClick={() => addWater(-250)}>
                                    <span className="add-icon">&#x274C;</span> -250ml
                                </button>
                                <button className="hydration-add-btn" onClick={() => addWater(250)}>
                                    <span className="add-icon">&#x1F4A7;</span> +250ml
                                </button>
                                <button className="hydration-add-btn" onClick={() => addWater(500)}>
                                    <span className="add-icon">&#x1F376;</span> +500ml
                                </button>
                            </div>
                        </div>

                        {/* PILL BOX INVENTORY */}
                        <div className="dash-card pillbox">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">PILL BOX INVENTORY</h3>
                                <div className="pillbox-view-toggle">
                                    <button className="pillbox-view-btn active">&#x1F4C5;</button>
                                    <button className="pillbox-view-btn">&#x2630;</button>
                                </div>
                            </div>
                            <div className="pillbox-list">
                                {medications.length === 0 ? (
                                    <div className="pill-item">
                                        <div className="pill-info">
                                            <span className="pill-name">No active missions.</span>
                                        </div>
                                    </div>
                                ) : (
                                    medications.map(med => (
                                        <div key={med.id} className={`pill-item ${med.taken ? 'taken' : ''}`}>
                                            <div className={`pill-check ${med.taken ? 'checked' : (med.type === 'liquid' ? '' : 'urgent')}`}>
                                                {med.taken ? '&#x2713;' : (med.type === 'pill' ? '&#x1F48A;' : '&#x1F9EA;')}
                                            </div>
                                            <div className="pill-info">
                                                <div className={`pill-name ${med.taken ? 'done' : ''}`}>
                                                    {med.name}
                                                    <span className={`pill-tag ${med.type === 'pill' ? 'pill-tag-antibiotic' : ''}`}>
                                                        {med.type.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="pill-details">
                                                    {med.schedule_time} {med.dosage ? `\u2022 ${med.dosage}` : ''}
                                                </div>
                                            </div>
                                            <div className="pill-status">
                                                {med.taken ? (
                                                    <span className="pill-taken-badge">TAKEN!</span>
                                                ) : (
                                                    <button className="pill-mark-btn" onClick={() => takeMedication(med.id)}>
                                                        MARK DONE
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM ROW: Mood + Urine + Chart */}
                    <div className="dash-row-bottom">
                        {/* LEFT: Split into Mood and Urine */}
                        <div className="dash-col-stats">
                            {/* KIDNEY MOOD */}
                            <div className="dash-card">
                                <div className="dash-card-header">
                                    <h3 className="dash-card-title">KIDNEY MOOD</h3>
                                </div>
                                <div className="kidney-mood">
                                    <div className="kidney-mood-emoji">
                                        {kidneyMood === 'HAPPY' ? '\u2764\uFE0F' : '\u{1F335}'}
                                    </div>
                                    <div className="kidney-mood-label" style={kidneyMood === 'THIRSTY' ? { background: '#FF9800' } : {}}>
                                        {kidneyMood === 'HAPPY' ? 'FEELING HAPPY!' : 'NEED WATER...'}
                                    </div>
                                </div>
                            </div>

                            {/* URINE LOGGER */}
                            {user && (
                                <UrineLogger
                                    userId={user.id}
                                    onLog={awardXP}
                                    medications={medications}
                                    dailyHydration={dailyHydration}
                                    externalAchievements={achievements}
                                    onAchievementUnlocked={onAchievementUnlocked}
                                />
                            )}
                        </div>

                        {/* WEEKLY FLOW */}
                        <div className="dash-card weekly-flow">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">WEEKLY FLOW</h3>
                            </div>
                            <div className="weekly-chart">
                                {weeklyData.map((day, idx) => (
                                    <div key={idx} className="weekly-bar-wrapper">
                                        <div
                                            className={`weekly-bar ${idx === weeklyData.length - 1 ? 'today' : ''}`}
                                            style={{ height: `${Math.max(Math.min((day.amount / 2500) * 100, 100), 5)}%` }}
                                        />
                                        <span className="weekly-day">{day.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="dash-footer">
                    &#x1F512; DATA ENCRYPTED SECURELY. CONSULT YOUR GP BEFORE CHANGING DOSAGE.
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
        </div>
    );
}
