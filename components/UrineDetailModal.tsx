"use client";

import { useState, useEffect } from "react";
import { UrineLog, UrineAchievement, Medication, UrineHealthAlert } from "@/types";
import UrineHeatmap from "./UrineHeatmap";
import UrineAchievements from "./UrineAchievements";
import UrineHealthAlerts from "./UrineHealthAlerts";
import UrineColorCompare from "./UrineColorCompare";
import UrineInsights from "./UrineInsights";

type Tab = "heatmap" | "achievements" | "health" | "compare" | "insights";

interface UrineDetailModalProps {
    todayLogs: UrineLog[];
    weeklyLogs: UrineLog[];
    achievements: UrineAchievement[];
    medications: Medication[];
    dailyHydration: number;
    alerts: UrineHealthAlert[];
    onClose: () => void;
}

export default function UrineDetailModal({
    todayLogs,
    weeklyLogs,
    achievements,
    medications,
    dailyHydration,
    alerts,
    onClose,
}: UrineDetailModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("heatmap");

    // ESC key to close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // Prevent body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const tabs: { key: Tab; label: string }[] = [
        { key: "heatmap", label: "HEATMAP" },
        { key: "achievements", label: "BADGES" },
        { key: "health", label: "HEALTH" },
        { key: "compare", label: "COLOR GUIDE" },
        { key: "insights", label: "INSIGHTS" },
    ];

    return (
        <div className="urine-modal-overlay" onClick={onClose}>
            <div className="urine-modal-panel" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="urine-modal-header">
                    <h3 className="dash-card-title">ARMSTRONG URINE CHART &mdash; DETAILED ANALYSIS</h3>
                    <button className="urine-modal-close" onClick={onClose}>
                        &#x2715;
                    </button>
                </div>

                {/* Tabs */}
                <div className="urine-modal-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`urine-modal-tab ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="urine-modal-body">
                    {activeTab === "heatmap" && (
                        <UrineHeatmap weeklyLogs={weeklyLogs} />
                    )}
                    {activeTab === "achievements" && (
                        <UrineAchievements unlockedAchievements={achievements} />
                    )}
                    {activeTab === "health" && (
                        <UrineHealthAlerts
                            alerts={alerts}
                            todayLogs={todayLogs}
                            medications={medications}
                            dailyHydration={dailyHydration}
                        />
                    )}
                    {activeTab === "compare" && (
                        <UrineColorCompare />
                    )}
                    {activeTab === "insights" && (
                        <UrineInsights weeklyLogs={weeklyLogs} />
                    )}
                </div>
            </div>
        </div>
    );
}
