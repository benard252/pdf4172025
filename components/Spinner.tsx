
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. text-teal-500
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-teal-500' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${color}`}
        style={{ borderTopColor: 'transparent' }} // Ensure border-t-transparent works with dynamic color
      ></div>
    </div>
  );
};
