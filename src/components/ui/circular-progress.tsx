import React from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  className?: string;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  backgroundColor = 'currentColor',
  progressColor = 'currentColor',
  showPercentage = true,
  className = '',
  label,
}) => {
  // Ensure value is between 0 and 100
  const progressValue = Math.min(100, Math.max(0, value));
  
  // Calculate radius (subtracting stroke width to fit within SVG size)
  const radius = (size - strokeWidth) / 2;
  
  // Calculate circumference
  const circumference = radius * 2 * Math.PI;
  
  // Calculate stroke dash offset
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;
  
  return (
    <div className={`relative inline-flex ${className}`}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
        role="progressbar"
        aria-label={label || `${progressValue}% complete`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="text-primary-500"
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{Math.round(progressValue)}%</span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;