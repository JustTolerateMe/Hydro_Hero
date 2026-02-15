"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/Shared";

import { downloadData } from "@/utils/exportData";
import { urlBase64ToUint8Array } from "@/utils/helpers";

export default function SettingsPage() {
    const router = useRouter();
    const { user, profile, loading: authLoading, setProfile, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    // Preferences (localStorage)
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");

    // Hydration goal override
    const [goalOverride, setGoalOverride] = useState<number | "">("");
    const [goalSaved, setGoalSaved] = useState(false);

    // Password change
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchData = async () => {
            setGoalOverride(profile?.daily_water_goal_ml || 2000);

            // Load localStorage prefs
            const savedUnit = localStorage.getItem("hydro_weight_unit");
            if (savedUnit === "kg" || savedUnit === "lbs") {
                setWeightUnit(savedUnit);
            }

            setLoading(false);
        };
        fetchData();
    }, [user, authLoading, profile]);

    const handleUnitChange = (unit: "kg" | "lbs") => {
        setWeightUnit(unit);
        localStorage.setItem("hydro_weight_unit", unit);
    };

    const handleGoalSave = async () => {
        if (!user || goalOverride === "") return;
        setGoalSaved(false);

        await supabase
            .from("profiles")
            .update({ daily_water_goal_ml: Number(goalOverride) })
            .eq("id", user.id);

        setProfile(prev => prev ? { ...prev, daily_water_goal_ml: Number(goalOverride) } : prev);
        setGoalSaved(true);
        setTimeout(() => setGoalSaved(false), 3000);
    };

    const handlePasswordChange = async () => {
        setPasswordError("");
        setPasswordSuccess(false);

        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords don't match.");
            return;
        }

        setChangingPassword(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setPasswordError(error.message);
        } else {
            setPasswordSuccess(true);
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPasswordSuccess(false), 3000);
        }
        setChangingPassword(false);
    };

    const handleExport = async () => {
        if (!user) return;
        setExporting(true);

        const [hydration, meds, medLogs] = await Promise.all([
            supabase.from("hydration_logs").select("*").eq("user_id", user.id),
            supabase.from("medications").select("*").eq("user_id", user.id),
            supabase.from("medication_logs").select("*").eq("user_id", user.id)
        ]);

        const fullData = {
            profile,
            hydration_logs: hydration.data,
            medications: meds.data,
            medication_logs: medLogs.data,
            exported_at: new Date().toISOString()
        };

        downloadData(fullData, `hydro-hero-data-${new Date().toISOString().split('T')[0]}`);
        setExporting(false);
    };

    const handleLogout = async () => {
        await signOut();
    };

    // Notification Logic
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.pushManager.getSubscription().then(subscription => {
                    setNotificationsEnabled(!!subscription);
                });
            });
        }
    }, []);

    const handleToggleNotifications = async () => {
        if (!("serviceWorker" in navigator)) return;

        if (notificationsEnabled) {
            // Unsubscribe
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                setNotificationsEnabled(false);
            }
        } else {
            // Subscribe
            try {
                const registration = await navigator.serviceWorker.ready;
                const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!vapidKey) return console.error("Missing VAPID key");

                const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });

                await fetch("/api/push/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subscription, userId: user?.id })
                });

                setNotificationsEnabled(true);
            } catch (err) {
                console.error("Failed to subscribe:", err);
            }
        }
    };

    if (authLoading || loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="dash">
            <Sidebar user={user} profile={profile} />

            <div className="dash-main">
                <div className="dash-header">
                    <h1 className="dash-header-title">SETTINGS</h1>
                </div>

                <div className="dash-content">

                    {/* PREFERENCES */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h3 className="dash-card-title">PREFERENCES</h3>
                        </div>
                        <div className="settings-section">
                            <div className="setting-row">
                                <div className="setting-info">
                                    <div className="setting-label">WEIGHT UNIT</div>
                                    <div className="setting-desc">Display weight in kilograms or pounds</div>
                                </div>
                                <div className="unit-toggle">
                                    <button
                                        className={`unit-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                                        onClick={() => handleUnitChange('kg')}
                                    >KG</button>
                                    <button
                                        className={`unit-btn ${weightUnit === 'lbs' ? 'active' : ''}`}
                                        onClick={() => handleUnitChange('lbs')}
                                    >LBS</button>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div className="setting-info">
                                    <div className="setting-label">DAILY HYDRATION GOAL</div>
                                    <div className="setting-desc">Override the auto-calculated water target (in ml)</div>
                                </div>
                                <div className="setting-goal-row">
                                    <input
                                        type="number"
                                        className="onboard-input setting-goal-input"
                                        value={goalOverride}
                                        onChange={e => setGoalOverride(e.target.value === "" ? "" : Number(e.target.value))}
                                        min={500}
                                        max={10000}
                                    />
                                    <span className="setting-goal-unit">ML</span>
                                    <button className="setting-save-btn" onClick={handleGoalSave}>
                                        {goalSaved ? "SAVED!" : "SAVE"}
                                    </button>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div className="setting-info">
                                    <div className="setting-label">DAILY REMINDER</div>
                                    <div className="setting-desc">Enable push notifications for hydration alerts</div>
                                </div>
                                <div className="unit-toggle">
                                    <button
                                        className={`unit-btn ${notificationsEnabled ? 'active' : ''}`}
                                        onClick={handleToggleNotifications}
                                    >
                                        {notificationsEnabled ? "ON" : "OFF"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACCOUNT */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h3 className="dash-card-title">ACCOUNT</h3>
                        </div>
                        <div className="settings-section">
                            <div className="setting-row">
                                <div className="setting-info">
                                    <div className="setting-label">EMAIL</div>
                                    <div className="setting-desc">{user?.email}</div>
                                </div>
                            </div>

                            <div className="setting-row setting-row-column">
                                <div className="setting-info">
                                    <div className="setting-label">CHANGE PASSWORD</div>
                                    <div className="setting-desc">Update your account password</div>
                                </div>
                                <div className="password-fields">
                                    <input
                                        type="password"
                                        className="onboard-input"
                                        placeholder="New password..."
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        className="onboard-input"
                                        placeholder="Confirm password..."
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                    {passwordError && <div className="setting-error">{passwordError}</div>}
                                    {passwordSuccess && <div className="setting-success">PASSWORD UPDATED!</div>}
                                    <button
                                        className="setting-save-btn"
                                        onClick={handlePasswordChange}
                                        disabled={changingPassword || !newPassword}
                                    >
                                        {changingPassword ? "UPDATING..." : "UPDATE PASSWORD"}
                                    </button>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div className="setting-info">
                                    <div className="setting-label">EXPORT DATA</div>
                                    <div className="setting-desc">Download all your hydration and medication data</div>
                                </div>
                                <button className="setting-save-btn" onClick={handleExport} disabled={exporting}>
                                    {exporting ? "EXPORTING..." : "EXPORT JSON"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* DANGER ZONE */}
                    <div className="dash-card dash-danger-zone">
                        <div className="dash-card-header danger-header">
                            <h3 className="dash-card-title">DANGER ZONE</h3>
                        </div>
                        <div className="settings-section">
                            <div className="setting-row">
                                <div className="setting-info">
                                    <div className="setting-label">LOGOUT</div>
                                    <div className="setting-desc">Sign out of your account on this device</div>
                                </div>
                                <button className="danger-btn" onClick={handleLogout}>
                                    LOGOUT
                                </button>
                            </div>

                            <div className="setting-row disabled-row">
                                <div className="setting-info">
                                    <div className="setting-label">DELETE ACCOUNT</div>
                                    <div className="setting-desc">Permanently delete your account and all data. This cannot be undone.</div>
                                </div>
                                <span className="setting-coming-soon">COMING SOON</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
