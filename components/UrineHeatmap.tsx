"use client";

import { UrineLog } from "@/types";
import { computeWeeklyHeatmap, getColorForScale } from "@/utils/urineHelpers";

interface UrineHeatmapProps {
    weeklyLogs: UrineLog[];
}

export default function UrineHeatmap({ weeklyLogs }: UrineHeatmapProps) {
    const heatmapData = computeWeeklyHeatmap(weeklyLogs);

    // Show hours from 6am to 11pm
    const hours = Array.from({ length: 18 }, (_, i) => i + 6);

    if (weeklyLogs.length === 0) {
        return (
            <div className="urine-no-data">
                <p>&#x1F4CA; No data yet! Start logging to see your weekly heatmap.</p>
            </div>
        );
    }

    return (
        <div>
            <p className="urine-heatmap-title">WEEKLY HYDRATION HEATMAP</p>
            <p className="urine-heatmap-subtitle">Each cell shows your urine color at that hour</p>

            {/* Hour labels */}
            <div className="urine-heatmap">
                <div className="urine-heatmap-row">
                    <span className="urine-heatmap-day-label"></span>
                    <span className="urine-heatmap-summary-spacer"></span>
                    {hours.map((h) => (
                        <span key={h} className="urine-heatmap-hour-label">
                            {h > 12 ? h - 12 : h}{h >= 12 ? "p" : "a"}
                        </span>
                    ))}
                </div>

                {/* Day rows */}
                {heatmapData.map((day) => (
                    <div key={day.date} className="urine-heatmap-row">
                        <span className="urine-heatmap-day-label">{day.dayLabel}</span>
                        <span
                            className="urine-heatmap-summary"
                            style={{
                                backgroundColor: day.averageColor > 0
                                    ? getColorForScale(Math.round(day.averageColor))
                                    : "#f0f0f0",
                            }}
                            title={day.averageColor > 0 ? `Avg: ${day.averageColor.toFixed(1)}` : "No data"}
                        />
                        {hours.map((h) => {
                            const log = day.logs.find((l) => l.hour === h);
                            return (
                                <span
                                    key={h}
                                    className={`urine-heatmap-cell ${log ? "" : "empty"}`}
                                    style={log ? { backgroundColor: getColorForScale(log.color_scale) } : {}}
                                    title={log ? `Scale ${log.color_scale} at ${h > 12 ? h - 12 : h}${h >= 12 ? "PM" : "AM"}` : ""}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="urine-heatmap-legend">
                <span className="urine-heatmap-legend-label">OPTIMAL</span>
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#F5F5DC" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#FFF9C4" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#FFF176" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#FFEE58" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#FFD54F" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#FFB74D" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#FF8A65" }} />
                <span className="urine-heatmap-legend-swatch" style={{ backgroundColor: "#BF360C" }} />
                <span className="urine-heatmap-legend-label">CRITICAL</span>
            </div>
        </div>
    );
}
