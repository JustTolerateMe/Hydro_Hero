/**
 * Calculate daily water goal based on weight and unit.
 * Formula: weight_in_kg * 35 ml
 */
export function calculateWaterGoal(weight: number | "", weightUnit: "kg" | "lbs"): number {
    let weightKg = Number(weight) || 0;
    if (weightUnit === "lbs") {
        weightKg = weightKg * 0.453592;
    }
    return Math.round(weightKg * 35);
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
