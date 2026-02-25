import {
    UrineColorScale,
    UrineColorInfo,
    UrineCategoryInfo,
    UrineAchievementDef,
    UrineAchievementKey,
    UrineAchievement,
    UrineLog,
    UrineSmartFeedback,
    UrineHealthAlert,
    UrineWeeklyHeatmapDay,
    Medication,
} from "@/types";

// --- CONSTANTS ---

export const URINE_COLORS: UrineColorInfo[] = [
    { scale: 1, color: "#FFFDD8", label: "Clear", category: "optimal", xp: 10 },
    { scale: 2, color: "#FFFBA8", label: "Pale Straw", category: "optimal", xp: 10 },
    { scale: 3, color: "#FCE974", label: "Straw", category: "good", xp: 5 },
    { scale: 4, color: "#FFCE79", label: "Light Yellow", category: "good", xp: 5 },
    { scale: 5, color: "#FFBA00", label: "Yellow", category: "warning", xp: 2 },
    { scale: 6, color: "#EAC853", label: "Amber", category: "warning", xp: 2 },
    { scale: 7, color: "#E1C161", label: "Dark Amber", category: "critical", xp: 2 },
    { scale: 8, color: "#898253", label: "Tea Colored", category: "critical", xp: 2 },
];

export const URINE_CATEGORIES: UrineCategoryInfo[] = [
    { category: "optimal", label: "OPTIMAL HYDRATION!", badgeColor: "#4CAF50", scaleRange: "1-2" },
    { category: "good", label: "MINIMAL DEHYDRATION", badgeColor: "#2196F3", scaleRange: "3-4" },
    { category: "warning", label: "SIGNIFICANT DEHYDRATION", badgeColor: "#FF9800", scaleRange: "5-6" },
    { category: "critical", label: "SEVERE DEHYDRATION", badgeColor: "#E53935", scaleRange: "7-8" },
];

export const ACHIEVEMENT_DEFINITIONS: UrineAchievementDef[] = [
    { key: "first_log", name: "FIRST DROP", description: "Log your first urine color", icon: "\u{1F4A7}", tier: "bronze" },
    { key: "hydration_streak_3", name: "TRIPLE STREAM", description: "3 optimal logs in a row", icon: "\u{1F4AA}", tier: "bronze" },
    { key: "golden_flow", name: "GOLDEN FLOW", description: "7 optimal logs in a row", icon: "\u{1F31F}", tier: "gold" },
    { key: "rehydration_master", name: "REHYDRATION MASTER", description: "Go from amber to clear in 2 hours", icon: "\u26A1", tier: "gold" },
    { key: "consistency_king", name: "CONSISTENCY KING", description: "Log every day for 7 straight days", icon: "\u{1F451}", tier: "silver" },
    { key: "early_bird", name: "EARLY BIRD", description: "Log before 8am, 5 times", icon: "\u{1F305}", tier: "bronze" },
    { key: "week_warrior", name: "WEEK WARRIOR", description: "7 days with 6+ logs each", icon: "\u{1F6E1}", tier: "gold" },
    { key: "color_rainbow", name: "FULL SPECTRUM", description: "Log all 8 colors at least once", icon: "\u{1F308}", tier: "silver" },
    { key: "night_owl", name: "NIGHT OWL", description: "Log after 10pm, 5 times", icon: "\u{1F319}", tier: "bronze" },
    // Hydration achievements
    { key: "hydro_goal", name: "FULL TANK", description: "Reach your daily hydration goal", icon: "\u{1F680}", tier: "bronze" },
    { key: "hydro_streak_3", name: "CONSISTENT FLOW", description: "Hit your daily goal for 3 straight days", icon: "\u{1F30A}", tier: "silver" },
];

// --- PURE FUNCTIONS ---

export function getXPForScale(scale: UrineColorScale): number {
    const info = URINE_COLORS.find(c => c.scale === scale);
    return info?.xp ?? 2;
}

export function getUrineCategory(scale: UrineColorScale): UrineCategoryInfo {
    if (scale <= 2) return URINE_CATEGORIES[0];
    if (scale <= 4) return URINE_CATEGORIES[1];
    if (scale <= 6) return URINE_CATEGORIES[2];
    return URINE_CATEGORIES[3];
}

export function getSmartFeedback(
    scale: UrineColorScale,
    todayLogs: UrineLog[],
    _weeklyLogs: UrineLog[],
    now: Date,
    medications: Medication[]
): UrineSmartFeedback {
    const hour = now.getHours();

    // Critical: Severe dehydration (7-8)
    if (scale >= 7) {
        return {
            message: "SEVERE DEHYDRATION! Drink at least 500ml of water immediately. Your body is in a water-saving crisis.",
            type: "warning",
            icon: "\u{1F6A8}",
        };
    }

    // Warning: Significant dehydration (5-6)
    if (scale >= 5) {
        return {
            message: `SIGNIFICANT DEHYDRATION DETECTED. Drink water soon to rehydrate and avoid fatigue or headaches.`,
            type: "warning",
            icon: "\u26A0\uFE0F",
        };
    }

    // Streak: 3+ optimal in a row
    const recentLogs = [...todayLogs].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (scale <= 2 && recentLogs.length >= 2) {
        const lastTwo = recentLogs.slice(0, 2);
        if (lastTwo.every(l => l.color_scale <= 2)) {
            return {
                message: "OPTIMAL STREAK! 3+ perfect readings in a row! Keep it flowing!",
                type: "streak",
                icon: "\u{1F525}",
            };
        }
    }

    // Medication note
    const medNote = getMedicationNotes(medications);
    if (medNote && scale >= 3 && scale <= 5) {
        return {
            message: medNote,
            type: "med_note",
            icon: "\u{1F48A}",
        };
    }

    // Time-based reminder
    if (todayLogs.length > 0) {
        const lastLog = recentLogs[0];
        const lastLogTime = new Date(lastLog.created_at);
        const hoursSince = (now.getTime() - lastLogTime.getTime()) / (1000 * 60 * 60);
        if (hoursSince >= 4) {
            return {
                message: `CHECK-IN TIME! It's been ${Math.floor(hoursSince)} hours since your last log.`,
                type: "reminder",
                icon: "\u23F0",
            };
        }
    }

    // Optimal encouragement
    if (scale <= 2) {
        const messages = [
            "PERFECT HYDRATION! Your kidneys are running at full power!",
            "CRYSTAL CLEAR! Your filtration system is in peak condition!",
            "OPTIMAL LEVELS! You're a hydration superhero!",
        ];
        return {
            message: messages[Math.floor(Math.random() * messages.length)],
            type: "encouragement",
            icon: "\u{1F4AA}",
        };
    }

    // Minimal Dehydration (3-4)
    if (scale <= 4) {
        return {
            message: "Minimal dehydration detected. Keep sipping to return to the optimal green zone.",
            type: "encouragement",
            icon: "\u2705",
        };
    }

    // Warning default
    return {
        message: "Your body is signaling dehydration. Time to drink up!",
        type: "warning",
        icon: "\u{1F4A7}",
    };
}

export function computeHealthAlerts(
    todayLogs: UrineLog[],
    weeklyLogs: UrineLog[],
    dailyHydration: number,
    medications: Medication[]
): UrineHealthAlert[] {
    const alerts: UrineHealthAlert[] = [];

    // Dark despite high water intake
    if (todayLogs.length >= 2 && dailyHydration > 1500) {
        const avgColor = todayLogs.reduce((sum, l) => sum + l.color_scale, 0) / todayLogs.length;
        if (avgColor >= 5) {
            alerts.push({
                type: "dark_despite_hydration",
                severity: "warning",
                message: "Your urine is dark despite good water intake. This could indicate other factors. Consider talking to your doctor.",
            });
        }
    }

    // Excessive frequency
    if (todayLogs.length > 10) {
        const hasDiuretics = checkForDiuretics(medications);
        if (!hasDiuretics) {
            alerts.push({
                type: "excessive_frequency",
                severity: "warning",
                message: `You've logged ${todayLogs.length} times today (normal: 6-8). If this persists, consult a healthcare provider.`,
            });
        }
    }

    // No urination in 8+ hours
    if (todayLogs.length > 0) {
        const lastLog = todayLogs.reduce((latest, l) =>
            new Date(l.created_at) > new Date(latest.created_at) ? l : latest
        );
        const hoursSince = (Date.now() - new Date(lastLog.created_at).getTime()) / (1000 * 60 * 60);
        if (hoursSince >= 8) {
            alerts.push({
                type: "no_urination",
                severity: "critical",
                message: `No log in ${Math.floor(hoursSince)} hours. Ensure you're drinking enough water. If you can't urinate, seek medical attention.`,
            });
        }
    }

    // Medication notes
    const hasDiuretics = checkForDiuretics(medications);
    if (hasDiuretics) {
        alerts.push({
            type: "medication_note",
            severity: "info",
            message: "You're taking a diuretic. Increased frequency (8-10+ times/day) may be expected.",
        });
    }

    const hasVitamins = checkForVitamins(medications);
    if (hasVitamins) {
        alerts.push({
            type: "medication_note",
            severity: "info",
            message: "Vitamins (especially B-complex) can make urine bright yellow. This is normal!",
        });
    }

    // Consistently dark across the week (Avg >= 5.0)
    if (weeklyLogs.length >= 10) {
        const weekAvg = weeklyLogs.reduce((sum, l) => sum + l.color_scale, 0) / weeklyLogs.length;
        if (weekAvg >= 5.0) {
            alerts.push({
                type: "dark_despite_hydration",
                severity: "critical",
                message: "Your weekly average shows persistent significant dehydration. Please increase your baseline fluid intake.",
            });
        }
    }

    return alerts;
}

export function checkAchievements(
    todayLogs: UrineLog[],
    weeklyLogs: UrineLog[],
    existing: UrineAchievement[]
): UrineAchievementKey[] {
    const unlocked = new Set(existing.map(a => a.achievement_key));
    const newKeys: UrineAchievementKey[] = [];
    const allLogs = [...weeklyLogs].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // FIRST DROP
    if (!unlocked.has("first_log") && allLogs.length >= 1) {
        newKeys.push("first_log");
    }

    // TRIPLE STREAM: 3 optimal in a row
    if (!unlocked.has("hydration_streak_3")) {
        let streak = 0;
        for (const log of allLogs) {
            streak = log.color_scale <= 2 ? streak + 1 : 0;
            if (streak >= 3) { newKeys.push("hydration_streak_3"); break; }
        }
    }

    // GOLDEN FLOW: 7 optimal in a row
    if (!unlocked.has("golden_flow")) {
        let streak = 0;
        for (const log of allLogs) {
            streak = log.color_scale <= 2 ? streak + 1 : 0;
            if (streak >= 7) { newKeys.push("golden_flow"); break; }
        }
    }

    // REHYDRATION MASTER: amber (>=6) to clear (<=2) within 2 hours
    if (!unlocked.has("rehydration_master")) {
        for (let i = 0; i < allLogs.length - 1; i++) {
            if (allLogs[i].color_scale >= 6) {
                for (let j = i + 1; j < allLogs.length; j++) {
                    const timeDiff = new Date(allLogs[j].created_at).getTime() - new Date(allLogs[i].created_at).getTime();
                    if (timeDiff > 2 * 60 * 60 * 1000) break;
                    if (allLogs[j].color_scale <= 2) {
                        newKeys.push("rehydration_master");
                        break;
                    }
                }
                if (newKeys.includes("rehydration_master")) break;
            }
        }
    }

    // CONSISTENCY KING: 7 consecutive days with at least 1 log
    if (!unlocked.has("consistency_king")) {
        const daySet = new Set(allLogs.map(l => l.created_at.split("T")[0]));
        const days = Array.from(daySet).sort();
        let consecutive = 1;
        for (let i = 1; i < days.length; i++) {
            const prev = new Date(days[i - 1]);
            const curr = new Date(days[i]);
            const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            consecutive = diff === 1 ? consecutive + 1 : 1;
            if (consecutive >= 7) { newKeys.push("consistency_king"); break; }
        }
    }

    // EARLY BIRD: 5 logs before 8am
    if (!unlocked.has("early_bird")) {
        const earlyLogs = allLogs.filter(l => new Date(l.created_at).getHours() < 8);
        if (earlyLogs.length >= 5) newKeys.push("early_bird");
    }

    // WEEK WARRIOR: 7 days with 6+ logs each
    if (!unlocked.has("week_warrior")) {
        const dayMap = new Map<string, number>();
        allLogs.forEach(l => {
            const day = l.created_at.split("T")[0];
            dayMap.set(day, (dayMap.get(day) || 0) + 1);
        });
        const fullDays = Array.from(dayMap.values()).filter(c => c >= 6);
        if (fullDays.length >= 7) newKeys.push("week_warrior");
    }

    // FULL SPECTRUM: all 8 colors logged
    if (!unlocked.has("color_rainbow")) {
        const colorSet = new Set(allLogs.map(l => l.color_scale));
        if (colorSet.size >= 8) newKeys.push("color_rainbow");
    }

    // NIGHT OWL: 5 logs after 10pm
    if (!unlocked.has("night_owl")) {
        const nightLogs = allLogs.filter(l => new Date(l.created_at).getHours() >= 22);
        if (nightLogs.length >= 5) newKeys.push("night_owl");
    }

    return newKeys;
}

export function checkHydrationAchievements(
    dailyTotal: number,
    goal: number,
    weeklyLogs: { date: string; amount: number }[],
    existing: UrineAchievement[]
): UrineAchievementKey[] {
    const unlocked = new Set(existing.map(a => a.achievement_key));
    const newKeys: UrineAchievementKey[] = [];

    // FULL TANK: Reach daily goal
    if (!unlocked.has("hydro_goal") && dailyTotal >= goal) {
        newKeys.push("hydro_goal");
    }

    // CONSISTENT FLOW: Reach daily goal for 3 straight days
    if (!unlocked.has("hydro_streak_3")) {
        // We look at the last 3 days (including today)
        const lastThreeDays = weeklyLogs.slice(-3);
        if (lastThreeDays.length === 3 && lastThreeDays.every(d => d.amount >= goal)) {
            newKeys.push("hydro_streak_3");
        }
    }

    return newKeys;
}

export function computeWeeklyHeatmap(weeklyLogs: UrineLog[]): UrineWeeklyHeatmapDay[] {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const days: UrineWeeklyHeatmapDay[] = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];

        const dayLogs = weeklyLogs
            .filter(l => l.created_at.startsWith(dateStr))
            .map(l => ({
                hour: new Date(l.created_at).getHours(),
                color_scale: l.color_scale,
            }));

        const avgColor = dayLogs.length > 0
            ? dayLogs.reduce((sum, l) => sum + l.color_scale, 0) / dayLogs.length
            : 0;

        days.push({
            date: dateStr,
            dayLabel: dayNames[d.getDay()],
            logs: dayLogs,
            averageColor: Math.round(avgColor * 10) / 10,
        });
    }

    return days;
}

export function computePredictiveInsights(weeklyLogs: UrineLog[]): string[] {
    if (weeklyLogs.length < 5) return [];

    const insights: string[] = [];

    // Group by hour bracket
    const brackets: Record<string, { total: number; count: number }> = {
        "morning (6-9 AM)": { total: 0, count: 0 },
        "mid-morning (10 AM-12 PM)": { total: 0, count: 0 },
        "afternoon (1-4 PM)": { total: 0, count: 0 },
        "evening (5-8 PM)": { total: 0, count: 0 },
        "night (9 PM+)": { total: 0, count: 0 },
    };

    weeklyLogs.forEach(l => {
        const hour = new Date(l.created_at).getHours();
        let bracket: string;
        if (hour >= 6 && hour <= 9) bracket = "morning (6-9 AM)";
        else if (hour >= 10 && hour <= 12) bracket = "mid-morning (10 AM-12 PM)";
        else if (hour >= 13 && hour <= 16) bracket = "afternoon (1-4 PM)";
        else if (hour >= 17 && hour <= 20) bracket = "evening (5-8 PM)";
        else bracket = "night (9 PM+)";

        brackets[bracket].total += l.color_scale;
        brackets[bracket].count += 1;
    });

    // Find the worst time bracket
    let worstBracket = "";
    let worstAvg = 0;
    let bestBracket = "";
    let bestAvg = 9;

    Object.entries(brackets).forEach(([name, data]) => {
        if (data.count >= 2) {
            const avg = data.total / data.count;
            if (avg > worstAvg) { worstAvg = avg; worstBracket = name; }
            if (avg < bestAvg) { bestAvg = avg; bestBracket = name; }
        }
    });

    if (worstBracket && worstAvg >= 4.5) {
        insights.push(`You tend to be more dehydrated in the ${worstBracket}. Try drinking extra water beforehand.`);
    }

    if (bestBracket && bestAvg <= 2.5) {
        insights.push(`Your ${bestBracket} readings show great hydration - keep it up!`);
    }

    // Day-of-week analysis
    const dayTotals = new Map<number, { total: number; count: number }>();
    weeklyLogs.forEach(l => {
        const day = new Date(l.created_at).getDay();
        const existing = dayTotals.get(day) || { total: 0, count: 0 };
        existing.total += l.color_scale;
        existing.count += 1;
        dayTotals.set(day, existing);
    });

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let worstDay = -1;
    let worstDayAvg = 0;
    dayTotals.forEach((data, day) => {
        if (data.count >= 2) {
            const avg = data.total / data.count;
            if (avg > worstDayAvg) { worstDayAvg = avg; worstDay = day; }
        }
    });

    if (worstDay >= 0 && worstDayAvg >= 4.5) {
        insights.push(`${dayNames[worstDay]} seems to be your driest day. Plan extra hydration!`);
    }

    // Frequency insight
    const dayCountMap = new Map<string, number>();
    weeklyLogs.forEach(l => {
        const day = l.created_at.split("T")[0];
        dayCountMap.set(day, (dayCountMap.get(day) || 0) + 1);
    });
    const avgFreq = Array.from(dayCountMap.values()).reduce((a, b) => a + b, 0) / dayCountMap.size;
    if (avgFreq < 4) {
        insights.push(`You're averaging ${Math.round(avgFreq)} logs/day. Try to track 6-8 times for better insights.`);
    }

    return insights;
}

export function getMedicationNotes(medications: Medication[]): string | null {
    const names = medications.map(m => m.name.toLowerCase());

    const vitaminKeywords = ["vitamin", "b-complex", "b12", "multivitamin", "b2", "riboflavin"];
    const diureticKeywords = ["furosemide", "hydrochlorothiazide", "diuretic", "lasix", "spironolactone"];

    const hasVitamins = names.some(n => vitaminKeywords.some(k => n.includes(k)));
    const hasDiuretics = names.some(n => diureticKeywords.some(k => n.includes(k)));

    if (hasVitamins && hasDiuretics) {
        return "Note: Vitamins can cause bright yellow urine (normal), and diuretics increase frequency.";
    }
    if (hasVitamins) {
        return "Note: Vitamins (especially B-complex) can make urine bright yellow - this is normal!";
    }
    if (hasDiuretics) {
        return "Note: Your diuretic may increase urination frequency. 8-10+ times/day can be expected.";
    }
    return null;
}

export function getFrequencyStatus(
    count: number,
    hasDiuretics: boolean
): { label: string; status: "low" | "normal" | "high" } {
    const normalMin = hasDiuretics ? 8 : 6;
    const normalMax = hasDiuretics ? 12 : 8;

    if (count < normalMin) return { label: `${count}/${normalMin}-${normalMax}`, status: "low" };
    if (count > normalMax) return { label: `${count}/${normalMin}-${normalMax}`, status: "high" };
    return { label: `${count}/${normalMin}-${normalMax}`, status: "normal" };
}

export function getAchievementXPBonus(tier: "bronze" | "silver" | "gold"): number {
    if (tier === "gold") return 100;
    if (tier === "silver") return 50;
    return 25;
}

// --- INTERNAL HELPERS ---

function checkForDiuretics(medications: Medication[]): boolean {
    const keywords = ["furosemide", "hydrochlorothiazide", "diuretic", "lasix", "spironolactone"];
    return medications.some(m => keywords.some(k => m.name.toLowerCase().includes(k)));
}

function checkForVitamins(medications: Medication[]): boolean {
    const keywords = ["vitamin", "b-complex", "b12", "multivitamin", "b2", "riboflavin"];
    return medications.some(m => keywords.some(k => m.name.toLowerCase().includes(k)));
}

export function getColorForScale(scale: number): string {
    const info = URINE_COLORS.find(c => c.scale === scale);
    return info?.color ?? "#E0E0E0";
}
