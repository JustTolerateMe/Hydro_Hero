"use client";

interface SexPickerProps {
    value: string;
    onChange: (sex: string) => void;
}

export default function SexPicker({ value, onChange }: SexPickerProps) {
    return (
        <div className="activity-cards">
            <div
                className={`activity-card ${value === 'female' ? 'selected' : ''}`}
                onClick={() => onChange('female')}
            >
                <div className="activity-icon">&#x2640;&#xFE0F;</div>
                <div className="activity-name">FEMALE</div>
                <div className="activity-desc">Biological female</div>
            </div>
            <div
                className={`activity-card ${value === 'male' ? 'selected' : ''}`}
                onClick={() => onChange('male')}
            >
                <div className="activity-icon">&#x2642;&#xFE0F;</div>
                <div className="activity-name">MALE</div>
                <div className="activity-desc">Biological male</div>
            </div>
        </div>
    );
}
