"use client";

import { URINE_COLORS, URINE_CATEGORIES } from "@/utils/urineHelpers";

const CLINICAL_DESCRIPTIONS: Record<number, string> = {
    1: "Optimal hydration. Your urine is nearly clear, indicating an efficient filtration system.",
    2: "Well hydrated. This light straw color is the ideal target for daily health and performance.",
    3: "Hydrated. A standard healthy color, but keep sipping water to stay in the optimal range.",
    4: "Mild dehydration. Your body is starting to conserve water. Drink a glass of water now.",
    5: "Dehydrated. Noticeable lack of fluids. Increase your intake to avoid fatigue or headaches.",
    6: "Significant dehydration. Your kidneys are working hard to preserve fluid. Rehydrate immediately.",
    7: "Severe dehydration. Very low fluid levels detected. Drink at least 500ml of water right away.",
    8: "Critical dehydration / Tea colored. Your body is in a water-saving crisis. Hydrate now and monitor closely.",
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
