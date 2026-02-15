"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/Shared";
import WeightInput from "@/components/WeightInput";
import ActivityPicker from "@/components/ActivityPicker";
import MissionPicker from "@/components/MissionPicker";
import { calculateWaterGoal, convertToKg } from "@/utils/helpers";

export default function ProfilePage() {
    const { user, profile, loading: authLoading, setProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [editing, setEditing] = useState(false);

    // Editable fields
    const [username, setUsername] = useState("");
    const [weightKg, setWeightKg] = useState<number | "">("");
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [activityLevel, setActivityLevel] = useState("");
    const [mission, setMission] = useState("");

    // Stats
    const [totalWater, setTotalWater] = useState(0);
    const [totalMeds, setTotalMeds] = useState(0);

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchData = async () => {
            if (profile) {
                setUsername(profile.username || "");
                setWeightKg(profile.weight_kg || "");
                setActivityLevel(profile.activity_level || "");
                setMission(profile.mission || "");
            }

            // Fetch stats in parallel
            const [hydroRes, medsRes] = await Promise.all([
                supabase.from("hydration_logs").select("amount_ml").eq("user_id", user.id),
                supabase.from("medications").select("*", { count: "exact", head: true }).eq("user_id", user.id),
            ]);
            const total = hydroRes.data?.reduce((s: number, l: { amount_ml: number }) => s + l.amount_ml, 0) || 0;
            setTotalWater(total);
            setTotalMeds(medsRes.count || 0);

            setLoading(false);
        };
        fetchData();
    }, [user, authLoading, profile]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setSaved(false);

        const wKg = convertToKg(weightKg, weightUnit);
        const waterGoal = calculateWaterGoal(weightKg, weightUnit);

        const { error } = await supabase
            .from("profiles")
            .update({
                username: username.trim(),
                weight_kg: wKg,
                activity_level: activityLevel || null,
                daily_water_goal_ml: waterGoal,
                mission: mission || null,
            })
            .eq("id", user.id);

        if (!error) {
            setProfile(prev => prev ? {
                ...prev,
                username: username.trim(),
                weight_kg: wKg,
                activity_level: (activityLevel || null) as "sedentary" | "active" | "heroic" | null,
                daily_water_goal_ml: waterGoal,
                mission: (mission || null) as "stone_smasher" | "hydration_hero" | "skin_glow" | null,
            } : prev);
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const handleCancel = () => {
        if (profile) {
            setUsername(profile.username || "");
            setWeightKg(profile.weight_kg || "");
            setActivityLevel(profile.activity_level || "");
            setMission(profile.mission || "");
        }
        setEditing(false);
    };

    if (authLoading || loading) {
        return <LoadingScreen />;
    }

    const displayWeight = weightUnit === "lbs" && profile?.weight_kg
        ? Math.round(profile.weight_kg / 0.453592)
        : profile?.weight_kg;

    const missionLabels: Record<string, string> = {
        stone_smasher: "STONE SMASHER",
        hydration_hero: "HYDRATION HERO",
        skin_glow: "SKIN GLOW",
    };

    const activityLabels: Record<string, string> = {
        sedentary: "SEDENTARY",
        active: "ACTIVE",
        heroic: "HEROIC",
    };

    return (
        <div className="dash">
            <Sidebar user={user} profile={profile} />

            <div className="dash-main">
                <div className="dash-header">
                    <h1 className="dash-header-title">HERO ID CARD</h1>
                    <div className="dash-header-right">
                        {!editing ? (
                            <button className="dash-edit-btn" onClick={() => setEditing(true)}>
                                EDIT PROFILE
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="dash-cancel-btn" onClick={handleCancel}>CANCEL</button>
                                <button className="dash-save-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? "SAVING..." : "SAVE"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {saved && (
                    <div className="dash-success-banner">
                        PROFILE UPDATED SUCCESSFULLY!
                    </div>
                )}

                <div className="dash-content">
                    {/* HERO IDENTITY CARD */}
                    <div className="dash-card dash-profile-hero-card">
                        <div className="profile-hero-inner">
                            <div className="profile-avatar-large">
                                {(profile?.username || user?.email)?.[0]?.toUpperCase() || "H"}
                            </div>
                            <div className="profile-hero-info">
                                {editing ? (
                                    <input
                                        type="text"
                                        className="onboard-input profile-name-input"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Your codename..."
                                    />
                                ) : (
                                    <h2 className="profile-hero-name">{profile?.username || "Unknown Hero"}</h2>
                                )}
                                <div className="profile-hero-email">{user?.email}</div>
                                <div className="profile-hero-since">
                                    MEMBER SINCE {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SUIT CALIBRATION */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h3 className="dash-card-title">SUIT CALIBRATION</h3>
                        </div>

                        {editing ? (
                            <div className="profile-edit-section">
                                {/* Weight */}
                                <div className="profile-field">
                                    <label className="onboard-label">WEIGHT</label>
                                    <WeightInput
                                        weight={weightKg}
                                        weightUnit={weightUnit}
                                        onWeightChange={w => setWeightKg(w)}
                                        onUnitChange={u => setWeightUnit(u)}
                                    />
                                </div>

                                {/* Activity Level */}
                                <div className="profile-field">
                                    <label className="onboard-label">ACTIVITY LEVEL</label>
                                    <ActivityPicker
                                        value={activityLevel}
                                        onChange={level => setActivityLevel(level)}
                                    />
                                </div>

                                {/* Mission */}
                                <div className="profile-field">
                                    <label className="onboard-label">MISSION</label>
                                    <MissionPicker
                                        value={mission}
                                        onChange={m => setMission(m)}
                                    />
                                </div>

                                {/* Water Goal Preview */}
                                {weightKg !== "" && activityLevel && (
                                    <div className="water-goal-preview">
                                        Calculated daily water goal: <strong>{calculateWaterGoal(weightKg, weightUnit)} ml</strong>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile-view-section">
                                <div className="profile-stat-row">
                                    <span className="profile-stat-label">WEIGHT</span>
                                    <span className="profile-stat-value">{displayWeight || "—"} {weightUnit.toUpperCase()}</span>
                                </div>
                                <div className="profile-stat-row">
                                    <span className="profile-stat-label">ACTIVITY</span>
                                    <span className="profile-stat-value">{activityLabels[profile?.activity_level || ""] || "—"}</span>
                                </div>
                                <div className="profile-stat-row">
                                    <span className="profile-stat-label">WATER GOAL</span>
                                    <span className="profile-stat-value">{profile?.daily_water_goal_ml || 2000} ML / DAY</span>
                                </div>
                                <div className="profile-stat-row">
                                    <span className="profile-stat-label">MISSION</span>
                                    <span className="profile-stat-value">{missionLabels[profile?.mission || ""] || "—"}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* HERO STATS */}
                    <div className="dash-row-bottom">
                        <div className="dash-card">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">HYDRATION RECORD</h3>
                            </div>
                            <div className="profile-big-stat">
                                <div className="profile-big-stat-icon">&#x1F4A7;</div>
                                <div className="profile-big-stat-number">{(totalWater / 1000).toFixed(1)}L</div>
                                <div className="profile-big-stat-label">TOTAL WATER LOGGED</div>
                            </div>
                        </div>
                        <div className="dash-card">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">ARSENAL</h3>
                            </div>
                            <div className="profile-big-stat">
                                <div className="profile-big-stat-icon">&#x1F48A;</div>
                                <div className="profile-big-stat-number">{totalMeds}</div>
                                <div className="profile-big-stat-label">MEDICATIONS TRACKED</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
