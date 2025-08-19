import React from "react";

type Step = {
    label: string;
};

interface ProgressBarProps {
    steps: Step[];
  currentStep: number; // 0-based index
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

    return (
        <div className="w-full max-w-3xl p-6 bg-[#0f172a] rounded-xl shadow-md">
        {/* Top message */}
        <p className="text-white mb-3">
            {steps[currentStep]?.label
            ? `Currently: ${steps[currentStep].label}...`
            : "Completed 🎉"}
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full">
            <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
            />
        </div>

        {/* Steps */}
        <div className="flex justify-between mt-4 text-sm">
            {steps.map((step, index) => (
            <span
                key={index}
                className={`${
                index <= currentStep ? "text-indigo-400" : "text-gray-400"
                }`}
            >
                {step.label}
            </span>
            ))}
        </div>
        </div>
    );
};

export default ProgressBar;
