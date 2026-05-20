import React, { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:scale-[1.02] cursor-pointer';
  
  const variants = {
    primary: 'bg-accent hover:bg-purple-700 text-white focus:ring-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 border border-transparent',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-500/30 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/30 hover:shadow-lg hover:shadow-red-500/20 border border-transparent',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-500/30 dark:text-slate-300 dark:hover:bg-slate-800/80 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
};
