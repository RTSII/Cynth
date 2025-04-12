import React from 'react';

interface CircularProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  thickness?: 'thin' | 'regular' | 'thick';
  showValue?: boolean;
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  thickness = 'regular',
  showValue = true,
  label,
  color = 'primary',
  className = '',
}) => {
  // Ensure value is between 0-100
  const progressValue = Math.min(Math.max(0, value), 100);
  
  // Calculate the stroke-dasharray and stroke-dashoffset
  const radius = 50 - (thickness === 'thin' ? 3 : thickness === 'thick' ? 7 : 5);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;
  
  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };
  
  // Thickness values
  const thicknessValues = {
    thin: 3,
    regular: 5,
    thick: 7,
  };
  
  // Font size based on progress circle size
  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };
  
  // Font size for label
  const labelFontSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-primary-500 stroke-primary-500',
    secondary: 'text-secondary-500 stroke-secondary-500',
    success: 'text-success-500 stroke-success-500',
    warning: 'text-warning-500 stroke-warning-500',
    error: 'text-error-500 stroke-error-500',
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-neutral-200 fill-none"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={thicknessValues[thickness]}
        />
        
        {/* Progress circle */}
        <circle
          className={`fill-none transition-all duration-300 ease-in-out ${colorClasses[color]}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={thicknessValues[thickness]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      
      {/* Center text */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-semibold ${fontSizeClasses[size]} ${colorClasses[color]}`}>
            {Math.round(progressValue)}%
          </span>
          {label && (
            <span className={`${labelFontSizeClasses[size]} text-neutral-600 mt-1`}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
