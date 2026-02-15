"use client";

interface MissionPickerProps {
    value: string;
    onChange: (mission: string) => void;
}

export default function MissionPicker({ value, onChange }: MissionPickerProps) {
    return (
        <div className="mission-cards">
            <div
                className={`mission-card ${value === 'stone_smasher' ? 'selected' : ''}`}
                onClick={() => onChange('stone_smasher')}
            >
                <div className="mission-icon">&#x1F4A5;</div>
                <div className="mission-name">STONE SMASHER</div>
                <div className="mission-desc">Prevent Kidney Stones</div>
            </div>
            <div
                className={`mission-card ${value === 'hydration_hero' ? 'selected' : ''}`}
                onClick={() => onChange('hydration_hero')}
            >
                <div className="mission-icon">&#x1F4A7;</div>
                <div className="mission-name">HYDRATION HERO</div>
                <div className="mission-desc">General Health</div>
            </div>
            <div
                className={`mission-card ${value === 'skin_glow' ? 'selected' : ''}`}
                onClick={() => onChange('skin_glow')}
            >
                <div className="mission-icon">&#x2728;</div>
                <div className="mission-name">SKIN GLOW</div>
                <div className="mission-desc">Beauty &amp; Radiance</div>
            </div>
        </div>
    );
}
