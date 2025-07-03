import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  'aria-label'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'text-blue-500',
  className = '',
  'aria-label': ariaLabel = 'Chargement en cours'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <motion.div
        className={`${sizeClasses[size]} ${color}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 24 24" 
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            className="animate-spin"
          />
        </svg>
      </motion.div>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default LoadingSpinner;