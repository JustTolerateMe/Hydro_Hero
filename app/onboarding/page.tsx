"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/Shared";
import ActivityPicker from "@/components/ActivityPicker";
import MissionPicker from "@/components/MissionPicker";
import WeightInput from "@/components/WeightInput";
import { calculateWaterGoal, convertToKg } from "@/utils/helpers";

type OnboardingData = {
    username: string;
    weight_kg: number | "";
    weight_unit: "kg" | "lbs";
    activity_level: "" | "sedentary" | "active" | "heroic";
    mission: "" | "stone_smasher" | "hydration_hero" | "skin_glow";
};

const STEPS = 4;

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading } = useAuth({ skipOnboardingCheck: true });
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [direction, setDirection] = useState<"next" | "back">("next");

    const [data, setData] = useState<OnboardingData>({
        username: "",
        weight_kg: "",
        weight_unit: "kg",
        activity_level: "",
        mission: "",
    });

    const canGoNext = () => {
        switch (step) {
            case 1: return data.username.trim().length > 0;
            case 2: return data.weight_kg !== "" && Number(data.weight_kg) > 0 && data.activity_level !== "";
            case 3: return data.mission !== "";
            default: return true;
        }
    };

    const goNext = () => {
        if (!canGoNext()) return;
        setDirection("next");
        setStep(s => Math.min(s + 1, STEPS));
    };

    const goBack = () => {
        setDirection("back");
        setStep(s => Math.max(s - 1, 1));
    };

    const waterGoal = calculateWaterGoal(data.weight_kg, data.weight_unit);

    const [saveError, setSaveError] = useState("");

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setSaveError("");

        const weightKg = convertToKg(data.weight_kg, data.weight_unit);

        const { error } = await supabase
            .from("profiles")
            .update({
                username: data.username.trim(),
                weight_kg: weightKg,
                activity_level: data.activity_level,
                daily_water_goal_ml: waterGoal,
                mission: data.mission,
                onboarding_complete: true,
            })
            .eq("id", user.id);

        if (error) {
            console.error("Onboarding save error:", error);
            setSaveError("Failed to save: " + error.message + ". Make sure the migration SQL has been run on your database.");
            setSaving(false);
            return;
        }

        // Verify it actually saved
        const { data: check } = await supabase
            .from("profiles")
            .select("onboarding_complete")
            .eq("id", user.id)
            .single();

        if (!check?.onboarding_complete) {
            setSaveError("Profile update did not persist. Please run the migration SQL to add the missing columns to the profiles table.");
            setSaving(false);
            return;
        }

        setSaving(false);
        router.push("/dashboard");
    };

    if (loading) {
        return <LoadingScreen />;
    }

    const powerLevel = ((step - 1) / (STEPS - 1)) * 100;

    return (
        <div className="onboarding-container">
            {/* Halftone overlay */}
            <div className="onboarding-halftone" />

            {/* Power Level Bar */}
            <div className="power-bar-wrapper">
                <div className="power-bar-label">POWER LEVEL</div>
                <div className="power-bar-track">
                    <div className="power-bar-fill" style={{ width: `${powerLevel}%` }} />
                </div>
                <div className="power-bar-step">STEP {step} / {STEPS}</div>
            </div>

            {/* Step Panel */}
            <div className={`onboarding-panel slide-${direction}`} key={step}>

                {/* STEP 1: IDENTITY */}
                {step === 1 && (
                    <div className="onboarding-step">
                        <div className="step-scene">
                            <div className="speech-silhouette">
                                <div className="silhouette-body">?</div>
                                <div className="speech-bubble-onboard">
                                    <h2 className="step-headline">EVERY HERO NEEDS A CODENAME.</h2>
                                    <p className="step-subtext">What shall we call you, hero?</p>
                                    <input
                                        type="text"
                                        className="onboard-input"
                                        placeholder="Enter your Name (or Superhero Alias)"
                                        value={data.username}
                                        onChange={e => setData({ ...data, username: e.target.value })}
                                        autoFocus
                                    />
                                    <div className="speech-tail-onboard" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: PHYSICS */}
                {step === 2 && (
                    <div className="onboarding-step">
                        <h2 className="step-headline">CALIBRATING SUIT HYDRAULICS...</h2>
                        <p className="step-subtext">We need your stats to calculate the perfect hydration target.</p>

                        <div className="physics-inputs">
                            <div className="weight-section">
                                <div className="weight-icon">&#x1F3CB;</div>
                                <label className="onboard-label">WEIGHT</label>
                                <WeightInput
                                    weight={data.weight_kg}
                                    weightUnit={data.weight_unit}
                                    onWeightChange={w => setData({ ...data, weight_kg: w })}
                                    onUnitChange={u => setData({ ...data, weight_unit: u })}
                                />
                            </div>

                            <label className="onboard-label">ACTIVITY LEVEL</label>
                            <ActivityPicker
                                value={data.activity_level}
                                onChange={level => setData({ ...data, activity_level: level as OnboardingData["activity_level"] })}
                            />

                            {data.weight_kg !== "" && data.activity_level !== "" && (
                                <div className="water-goal-preview">
                                    Your daily water goal: <strong>{waterGoal} ml</strong>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3: MISSION */}
                {step === 3 && (
                    <div className="onboarding-step">
                        <h2 className="step-headline">CHOOSE YOUR MISSION.</h2>
                        <p className="step-subtext">Every hero has a purpose. What drives you?</p>

                        <MissionPicker
                            value={data.mission}
                            onChange={m => setData({ ...data, mission: m as OnboardingData["mission"] })}
                        />
                    </div>
                )}

                {/* STEP 4: LAUNCH */}
                {step === 4 && (
                    <div className="onboarding-step launch-step">
                        <div className="launch-badge">&#x1F680;</div>
                        <h2 className="step-headline">SUIT CALIBRATED!</h2>
                        <p className="step-subtext">You&apos;re ready to begin your mission, <strong>{data.username}</strong>.</p>

                        <div className="launch-summary">
                            <div className="summary-row">
                                <span className="summary-label">CODENAME</span>
                                <span className="summary-value">{data.username}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">WEIGHT</span>
                                <span className="summary-value">{data.weight_kg} {data.weight_unit.toUpperCase()}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">ACTIVITY</span>
                                <span className="summary-value">{(data.activity_level || '').toUpperCase()}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">WATER GOAL</span>
                                <span className="summary-value">{waterGoal} ML / DAY</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">MISSION</span>
                                <span className="summary-value">{(data.mission || '').replace('_', ' ').toUpperCase()}</span>
                            </div>
                        </div>

                        <button
                            className="btn-launch"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "LAUNCHING..." : "SUIT UP! \u{1F680}"}
                        </button>

                        {saveError && (
                            <div className="onboard-error">
                                {saveError}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            {step < STEPS && (
                <div className="onboarding-nav">
                    {step > 1 && (
                        <button className="btn-onboard-back" onClick={goBack}>
                            &#x25C0; BACK
                        </button>
                    )}
                    <div className="nav-spacer" />
                    <button
                        className="btn-onboard-next"
                        onClick={goNext}
                        disabled={!canGoNext()}
                    >
                        NEXT &#x25B6;
                    </button>
                </div>
            )}

            {step === STEPS && step > 1 && (
                <div className="onboarding-nav">
                    <button className="btn-onboard-back" onClick={goBack}>
                        &#x25C0; BACK
                    </button>
                    <div className="nav-spacer" />
                </div>
            )}
        </div>
    );
}
