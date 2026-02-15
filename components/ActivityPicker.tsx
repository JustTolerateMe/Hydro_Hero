"use client";

interface ActivityPickerProps {
    value: string;
    onChange: (level: string) => void;
}

export default function ActivityPicker({ value, onChange }: ActivityPickerProps) {
    return (
        <div className="activity-cards">
            <div
                className={`activity-card ${value === 'sedentary' ? 'selected' : ''}`}
                onClick={() => onChange('sedentary')}
            >
                <div className="activity-icon">&#x1FA91;</div>
                <div className="activity-name">SEDENTARY</div>
                <div className="activity-desc">Desk warrior</div>
            </div>
            <div
                className={`activity-card ${value === 'active' ? 'selected' : ''}`}
                onClick={() => onChange('active')}
            >
                <div className="activity-icon">&#x1F45F;</div>
                <div className="activity-name">ACTIVE</div>
                <div className="activity-desc">Regular mover</div>
            </div>
            <div
                className={`activity-card ${value === 'heroic' ? 'selected' : ''}`}
                onClick={() => onChange('heroic')}
            >
                <div className="activity-icon">&#x26A1;</div>
                <div className="activity-name">HEROIC</div>
                <div className="activity-desc">Peak performance</div>
            </div>
        </div>
    );
}
