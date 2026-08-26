import { useMemo } from "react";

export default function EligibilityMeter({ score = 0 }) {
  const { color, label, description, colorClass, ringColor } = useMemo(() => {
    if (score <= 40) {
      return {
        color: "red",
        label: "Low",
        description: "Your eligibility is low. Consider improving your credit score or income.",
        colorClass: "text-red-500",
        ringColor: "stroke-red-500",
      };
    } else if (score <= 70) {
      return {
        color: "blue",
        label: "Medium",
        description: "Your eligibility is moderate. You have a fair chance of approval.",
        colorClass: "text-blue-500",
        ringColor: "stroke-blue-500",
      };
    } else {
      return {
        color: "green",
        label: "High",
        description: "Your eligibility is high! You have a strong chance of approval.",
        colorClass: "text-green-500",
        ringColor: "stroke-green-500",
      };
    }
  }, [score]);

  // Calculate strokeDasharray for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress Meter */}
      <div className="relative h-40 w-40">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-500 ease-out`}
          />
        </svg>
        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
          <span className="text-xs text-slate-500">Score</span>
        </div>
      </div>

      {/* Label */}
      <p className={`mt-3 font-semibold ${colorClass}`}>{label} Eligibility</p>

      {/* Description */}
      <p className="mt-2 text-xs text-slate-500 text-center max-w-xs px-2">
        {description}
      </p>
    </div>
  );
}