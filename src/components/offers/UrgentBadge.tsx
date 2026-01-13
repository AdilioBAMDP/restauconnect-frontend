import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UrgentBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UrgentBadge: React.FC<UrgentBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded font-semibold bg-red-500 text-white ${sizeClasses[size]} ${className}`}
    >
      <AlertCircle className={iconSizes[size]} />
      URGENT
    </span>
  );
};

export default UrgentBadge;
