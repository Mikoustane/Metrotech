import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const textColor = variant === 'light' 
    ? 'text-white' 
    : 'text-gray-900 dark:text-white';

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <Link to="/" className="flex items-center space-x-2">
      {/* Logo PNG sans arrière-plan */}
      <div className="relative">
        <img 
          src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
          alt="METROTECH Logo" 
          className={`${sizeClasses[size]} w-auto object-contain`}
          style={{
            filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none'
          }}
          onError={(e) => {
            // Fallback en cas d'erreur de chargement
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        {/* Fallback texte si l'image ne charge pas */}
        <div className={`hidden ${textColor} font-bold text-xl`}>
          METROTECH
        </div>
      </div>
    </Link>
  );
};

export default Logo;