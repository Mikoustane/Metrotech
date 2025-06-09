import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left'
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation';
  
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-light shadow-mobile hover:shadow-lg focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-light shadow-mobile hover:shadow-lg focus:ring-secondary-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-light focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-dark-800 text-gray-300 hover:text-light focus:ring-gray-500'
  };
  
  const sizeStyles = {
    sm: 'text-sm px-4 py-2 min-h-[40px]',
    md: 'text-base px-6 py-3 min-h-[44px]',
    lg: 'text-lg px-8 py-4 min-h-[48px]'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;