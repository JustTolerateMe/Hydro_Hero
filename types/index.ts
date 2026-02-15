export type Profile = {
    id: string;
    username: string | null;
    avatar_url: string | null;
    weight_kg: number | null;
    activity_level: "sedentary" | "active" | "heroic" | null;
    daily_water_goal_ml: number | null;
    mission: "stone_smasher" | "hydration_hero" | "skin_glow" | null;
    onboarding_complete: boolean | null;
    xp: number | null;
};

export type HydrationLog = {
    id: number;
    user_id: string;
    amount_ml: number;
    created_at: string;
};

export type Medication = {
    id: number;
    name: string;
    dosage: string | null;
    schedule_time: string;
    type: "pill" | "liquid";
    taken?: boolean; // Derived optional property for UI
};

export type MedicationLog = {
    id: number;
    user_id: string;
    medication_id: number;
    taken_at_date: string;
    status: "taken" | "skipped";
    created_at: string;
};

export type WeeklyData = {
    date: string;
    amount: number;
}[];

// --- URINE LOGGER TYPES ---

export type UrineColorScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type UrineVolume = "small" | "medium" | "large";

export type UrineLog = {
    id: number;
    user_id: string;
    color_scale: UrineColorScale;
    volume: UrineVolume | null;
    notes: string | null;
    created_at: string;
};

export type UrineCategory = "optimal" | "good" | "warning" | "critical";

export type UrineColorInfo = {
    scale: UrineColorScale;
    color: string;
    label: string;
    category: UrineCategory;
    xp: number;
};

export type UrineCategoryInfo = {
    category: UrineCategory;
    label: string;
    badgeColor: string;
    scaleRange: string;
};

export type UrineAchievementKey =
    | "first_log"
    | "hydration_streak_3"
    | "golden_flow"
    | "rehydration_master"
    | "consistency_king"
    | "early_bird"
    | "week_warrior"
    | "color_rainbow"
    | "night_owl";

export type UrineAchievement = {
    id: number;
    user_id: string;
    achievement_key: UrineAchievementKey;
    unlocked_at: string;
};

export type UrineAchievementDef = {
    key: UrineAchievementKey;
    name: string;
    description: string;
    icon: string;
    tier: "bronze" | "silver" | "gold";
};

export type UrineHealthAlert = {
    type: "dark_despite_hydration" | "excessive_frequency" | "no_urination" | "medication_note";
    severity: "info" | "warning" | "critical";
    message: string;
};

export type UrineSmartFeedback = {
    message: string;
    type: "encouragement" | "warning" | "streak" | "reminder" | "med_note";
    icon: string;
};

export type UrineWeeklyHeatmapDay = {
    date: string;
    dayLabel: string;
    logs: { hour: number; color_scale: UrineColorScale }[];
    averageColor: number;
};
