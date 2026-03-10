"use client";

interface ClimatePickerProps {
    value: string;
    onChange: (climate: string) => void;
}

export default function ClimatePicker({ value, onChange }: ClimatePickerProps) {
    return (
        <div className="activity-cards">
            <div
                className={`activity-card ${value === 'cool' ? 'selected' : ''}`}
                onClick={() => onChange('cool')}
            >
                <div className="activity-icon">&#x2744;&#xFE0F;</div>
                <div className="activity-name">COOL</div>
                <div className="activity-desc">&lt; 20°C (68°F)</div>
            </div>
            <div
                className={`activity-card ${value === 'moderate' ? 'selected' : ''}`}
                onClick={() => onChange('moderate')}
            >
                <div className="activity-icon">&#x26C5;</div>
                <div className="activity-name">MODERATE</div>
                <div className="activity-desc">20-29°C (68-84°F)</div>
            </div>
            <div
                className={`activity-card ${value === 'hot' ? 'selected' : ''}`}
                onClick={() => onChange('hot')}
            >
                <div className="activity-icon">&#x1F525;</div>
                <div className="activity-name">HOT</div>
                <div className="activity-desc">&ge; 30°C (86°F)</div>
            </div>
        </div>
    );
}
