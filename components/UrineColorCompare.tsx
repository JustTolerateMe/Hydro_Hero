"use client";

import { URINE_COLORS, URINE_CATEGORIES } from "@/utils/urineHelpers";

const CLINICAL_DESCRIPTIONS: Record<number, string> = {
    1:  "You may be drinking too much water. Overhydration is rare but possible — a slight yellow tint is the healthier target.",
    2:  "Perfect! Pale yellow means you're drinking enough water and your kidneys are filtering well.",
    3:  "You're not drinking enough water. Aim for an extra glass or two in the next hour.",
    4:  "Orange urine signals dehydration. Certain vitamins (e.g. B2) and medications can also cause this — drink up!",
    5:  "Dark orange or brown urine may mean severe dehydration or your body isn't producing enough bile. Hydrate and monitor.",
    6:  "Very dark brown or black urine can indicate liver disease, rhabdomyolysis, or alkaptonuria. Seek medical attention.",
    7:  "Pink or red urine may be blood (hematuria) — a serious sign — or from beets, rhubarb, or certain medications. See a doctor if unsure.",
    8:  "Blue or green urine results from certain dyes in food or some medications. Green urine can also indicate a UTI.",
    9:  "Cloudy urine is often a sign of a urinary tract infection (UTI). Drink water and consult a doctor if it persists.",
    10: "White or milky urine may indicate chyluria, a condition where lymphatic fluid mixes with urine. See a healthcare provider.",
};

export default function UrineColorCompare() {
    return (
        <div>
            <p className="urine-section-title">COLOR COMPARISON GUIDE</p>
            <p className="urine-section-subtitle">
                Based on the Healthline urine color guide
            </p>

            <div className="urine-compare-grid">
                {URINE_COLORS.map((c) => {
                    const category = URINE_CATEGORIES.find(cat => cat.category === c.category);
                    return (
                        <div key={c.scale} className="urine-compare-card">
                            <div
                                className="urine-compare-swatch"
                                style={{ backgroundColor: c.color }}
                            />
                            <div className="urine-compare-label">{c.scale}. {c.label}</div>
                            <span
                                className="urine-compare-badge"
                                style={{ backgroundColor: category?.badgeColor }}
                            >
                                {category?.label}
                            </span>
                            <div className="urine-compare-desc">
                                {CLINICAL_DESCRIPTIONS[c.scale]}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="urine-compare-tip">
                <strong>&#x1F4A1; TIPS FOR ACCURACY:</strong>
                <ul>
                    <li>Compare under consistent white lighting for best results.</li>
                    <li>First morning urine is typically darker &mdash; this is normal.</li>
                    <li>Beets, berries, and some foods can temporarily change color.</li>
                    <li>B-vitamins often cause bright fluorescent yellow &mdash; not a concern.</li>
                </ul>
            </div>
        </div>
    );
}
