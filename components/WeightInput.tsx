"use client";

interface WeightInputProps {
    weight: number | "";
    weightUnit: "kg" | "lbs";
    onWeightChange: (weight: number | "") => void;
    onUnitChange: (unit: "kg" | "lbs") => void;
}

export default function WeightInput({ weight, weightUnit, onWeightChange, onUnitChange }: WeightInputProps) {
    return (
        <div className="weight-row">
            <input
                type="number"
                className="onboard-input weight-input"
                value={weight}
                onChange={e => onWeightChange(e.target.value === "" ? "" : Number(e.target.value))}
                min={1}
                placeholder="e.g. 70"
            />
            <div className="unit-toggle">
                <button
                    className={`unit-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                    onClick={() => onUnitChange('kg')}
                >KG</button>
                <button
                    className={`unit-btn ${weightUnit === 'lbs' ? 'active' : ''}`}
                    onClick={() => onUnitChange('lbs')}
                >LBS</button>
            </div>
        </div>
    );
}
