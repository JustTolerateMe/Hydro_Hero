"use client";

import { UrineHealthAlert, UrineLog, Medication } from "@/types";

interface UrineHealthAlertsProps {
    alerts: UrineHealthAlert[];
    todayLogs: UrineLog[];
    medications: Medication[];
    dailyHydration: number;
}

export default function UrineHealthAlerts({ alerts, todayLogs, medications, dailyHydration }: UrineHealthAlertsProps) {
    // Summary stats
    const avgColor = todayLogs.length > 0
        ? (todayLogs.reduce((sum, l) => sum + l.color_scale, 0) / todayLogs.length).toFixed(1)
        : "N/A";

    return (
        <div>
            <p className="urine-section-title">HEALTH INTEL</p>

            {/* Quick stats */}
            <div className="urine-health-stats">
                <div className="urine-health-stat">
                    <span className="urine-health-stat-value">{todayLogs.length}</span>
                    <span className="urine-health-stat-label">LOGS TODAY</span>
                </div>
                <div className="urine-health-stat">
                    <span className="urine-health-stat-value">{avgColor}</span>
                    <span className="urine-health-stat-label">AVG COLOR</span>
                </div>
                <div className="urine-health-stat">
                    <span className="urine-health-stat-value">{dailyHydration}ml</span>
                    <span className="urine-health-stat-label">WATER TODAY</span>
                </div>
                <div className="urine-health-stat">
                    <span className="urine-health-stat-value">{medications.length}</span>
                    <span className="urine-health-stat-label">ACTIVE MEDS</span>
                </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 ? (
                <div className="urine-alerts-list">
                    {alerts.map((alert, idx) => (
                        <div key={idx} className={`urine-alert-item ${alert.severity}`}>
                            <span className="urine-alert-icon">
                                {alert.severity === "critical" ? "\u{1F6A8}" : alert.severity === "warning" ? "\u26A0\uFE0F" : "\u{1F4A1}"}
                            </span>
                            <span className="urine-alert-text">{alert.message}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="urine-no-data">
                    <p>&#x2705; No health alerts! Everything looks good.</p>
                </div>
            )}
        </div>
    );
}
