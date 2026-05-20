import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={`flex flex-col space-y-1 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`px-4 py-2.5 border rounded-xl shadow-xs focus:outline-none focus:ring-3
            bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 
            transition-all duration-200 ease-out hover:border-slate-400 dark:hover:border-slate-500
            focus:scale-[1.01]
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-purple-500/25 focus:border-purple-500'}
            disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
