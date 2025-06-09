import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  const textColor = variant === 'light' 
    ? 'text-white' 
    : 'text-gray-900 dark:text-white';

  return (
    <Link to="/\" className="flex items-center space-x-2">
      <img 
        src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
        alt="METROTECH Logo" 
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;