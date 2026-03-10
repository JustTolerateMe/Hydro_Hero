/**
 * Calculate daily water goal based on new formula:
 * Water Intake (ml/day) = 0.75 * [(35 * W) + (350 * S) + A + T]
 * W = weight in kg
 * S = sex (female=0, male=1)
 * A = activity (sedentary=0, light=300, moderate=600, heavy=1000)
 * T = temperature/climate (cool/<20C=0, moderate/20-29C=300, hot/>30C=700)
 */
export function calculateWaterGoal(
    weight: number | "",
    weightUnit: "kg" | "lbs",
    sex: "male" | "female" | null | "",
    activityLevel: "sedentary" | "light" | "moderate" | "heavy" | "",
    climate: "cool" | "moderate" | "hot" | ""
): number {
    let weightKg = Number(weight) || 0;
    if (weightUnit === "lbs") {
        weightKg = weightKg * 0.453592;
    }

    const wComponent = 35 * weightKg;

    const sVal = sex === "male" ? 1 : 0;
    const sComponent = 350 * sVal;

    let aComponent = 0;
    if (activityLevel === "light") aComponent = 300;
    if (activityLevel === "moderate") aComponent = 600;
    if (activityLevel === "heavy") aComponent = 1000;

    let tComponent = 0;
    if (climate === "moderate") tComponent = 300;
    if (climate === "hot") tComponent = 700;

    const totalRaw = wComponent + sComponent + aComponent + tComponent;
    const recommended = totalRaw * 0.75;

    return Math.round(recommended);
}

/**
 * Convert weight to kg, rounding to 1 decimal place for lbs conversion.
 */
export function convertToKg(weight: number | "", weightUnit: "kg" | "lbs"): number {
    let wKg = Number(weight) || 0;
    if (weightUnit === "lbs") {
        wKg = Math.round(wKg * 0.453592 * 10) / 10;
    }
    return wKg;
}

/**
 * Calculate user level from XP. Every 100 XP = 1 level, starting at 1.
 */
export function getLevelFromXP(xp: number | null): number {
    return Math.floor((xp || 0) / 100) + 1;
}

export function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
