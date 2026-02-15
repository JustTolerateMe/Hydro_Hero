"use client";

import { UrineAchievement } from "@/types";
import { ACHIEVEMENT_DEFINITIONS } from "@/utils/urineHelpers";

interface UrineAchievementsProps {
    unlockedAchievements: UrineAchievement[];
}

export default function UrineAchievements({ unlockedAchievements }: UrineAchievementsProps) {
    const unlockedKeys = new Set(unlockedAchievements.map(a => a.achievement_key));

    return (
        <div>
            <p className="urine-section-title">ACHIEVEMENT BADGES</p>
            <p className="urine-section-subtitle">
                {unlockedKeys.size}/{ACHIEVEMENT_DEFINITIONS.length} UNLOCKED
            </p>

            <div className="urine-achievements-grid">
                {ACHIEVEMENT_DEFINITIONS.map((def) => {
                    const unlocked = unlockedKeys.has(def.key);
                    const record = unlockedAchievements.find(a => a.achievement_key === def.key);
                    const unlockDate = record
                        ? new Date(record.unlocked_at).toLocaleDateString()
                        : null;

                    return (
                        <div
                            key={def.key}
                            className={`urine-achievement-card ${unlocked ? "unlocked" : "locked"}`}
                        >
                            <div className="urine-achievement-icon">
                                {unlocked ? def.icon : "\u{1F512}"}
                            </div>
                            <div className="urine-achievement-name">{def.name}</div>
                            <div className="urine-achievement-desc">{def.description}</div>
                            <span className={`urine-achievement-tier ${def.tier}`}>
                                {def.tier.toUpperCase()}
                            </span>
                            {unlockDate && (
                                <div className="urine-achievement-date">
                                    Unlocked {unlockDate}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
