"use client";

import { URINE_COLORS, URINE_CATEGORIES } from "@/utils/urineHelpers";

const CLINICAL_DESCRIPTIONS: Record<number, string> = {
    1: "Nearly transparent. Excellent hydration - your kidneys are working efficiently.",
    2: "Very light color. Well-hydrated, ideal range for most people.",
    3: "Light straw color. Good hydration status, keep maintaining.",
    4: "Slightly deeper yellow. Adequate but consider drinking a bit more.",
    5: "Noticeable yellow. Your body is signaling it needs more fluids.",
    6: "Amber tint. Moderate dehydration - drink water soon.",
    7: "Dark amber. Significant dehydration - drink water immediately.",
    8: "Dark orange/brown. Severe dehydration or possible medical issue. Hydrate and consult a doctor if persistent.",
};

export default function UrineColorCompare() {
    return (
        <div>
            <p className="urine-section-title">COLOR COMPARISON GUIDE</p>
            <p className="urine-section-subtitle">
                Match your observation to the closest reference color
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
