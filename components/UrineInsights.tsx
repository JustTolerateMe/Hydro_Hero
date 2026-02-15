"use client";

import { UrineLog } from "@/types";
import { computePredictiveInsights } from "@/utils/urineHelpers";

interface UrineInsightsProps {
    weeklyLogs: UrineLog[];
}

export default function UrineInsights({ weeklyLogs }: UrineInsightsProps) {
    const insights = computePredictiveInsights(weeklyLogs);

    return (
        <div>
            <p className="urine-section-title">PREDICTIVE INSIGHTS</p>
            <p className="urine-section-subtitle">
                Patterns detected from your hydration data
            </p>

            {insights.length > 0 ? (
                <div className="urine-insights-list">
                    {insights.map((insight, idx) => (
                        <div key={idx} className="urine-insight-item">
                            <span className="urine-insight-icon">&#x1F52E;</span>
                            <span className="urine-insight-text">{insight}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="urine-no-data">
                    <p>&#x1F4CA; Not enough data yet! Keep logging for at least 5 entries to unlock predictive insights.</p>
                    <p className="urine-no-data-sub">The more you log, the smarter your insights become.</p>
                </div>
            )}
        </div>
    );
}
