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
                className={`activity-card ${value === 'light' ? 'selected' : ''}`}
                onClick={() => onChange('light')}
            >
                <div className="activity-icon">&#x1F6B6;</div>
                <div className="activity-name">LIGHT</div>
                <div className="activity-desc">Occasional walks</div>
            </div>
            <div
                className={`activity-card ${value === 'moderate' ? 'selected' : ''}`}
                onClick={() => onChange('moderate')}
            >
                <div className="activity-icon">&#x1F45F;</div>
                <div className="activity-name">MODERATE</div>
                <div className="activity-desc">Regular exercise</div>
            </div>
            <div
                className={`activity-card ${value === 'heavy' ? 'selected' : ''}`}
                onClick={() => onChange('heavy')}
            >
                <div className="activity-icon">&#x26A1;</div>
                <div className="activity-name">HEAVY</div>
                <div className="activity-desc">Intense training</div>
            </div>
        </div>
    );
}
