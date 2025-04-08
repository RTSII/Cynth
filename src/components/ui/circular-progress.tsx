import React from 'react';

interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`circular-progress ${size} ${className}`}>
      <svg viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${value}, 100`}
        />
      </svg>
      <span className="value">{value}%</span>
    </div>
  );
};