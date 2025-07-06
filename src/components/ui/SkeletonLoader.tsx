import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'image' | 'card' | 'list';
  lines?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'text', 
  lines = 3,
  className = '' 
}) => {
  const baseClasses = 'bg-gray-700 rounded animate-pulse';

  switch (type) {
    case 'title':
      return <div className={`${baseClasses} h-8 w-3/4 mb-4 ${className}`} />;
    
    case 'image':
      return <div className={`${baseClasses} w-full h-48 ${className}`} />;
    
    case 'card':
      return (
        <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
          <div className={`${baseClasses} h-6 w-3/4 mb-4`} />
          <div className={`${baseClasses} h-32 w-full mb-4`} />
          <div className={`${baseClasses} h-4 w-full mb-2`} />
          <div className={`${baseClasses} h-4 w-2/3`} />
        </div>
      );
    
    case 'list':
      return (
        <div className={className}>
          {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className={`${baseClasses} h-12 w-12 rounded-full`} />
              <div className="flex-1">
                <div className={`${baseClasses} h-4 w-3/4 mb-2`} />
                <div className={`${baseClasses} h-3 w-1/2`} />
              </div>
            </div>
          ))}
        </div>
      );
    
    default: // text
      return (
        <div className={className}>
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index} 
              className={`${baseClasses} h-4 mb-2 ${
                index === lines - 1 ? 'w-2/3' : 'w-full'
              }`} 
            />
          ))}
        </div>
      );
  }
};

export default SkeletonLoader;