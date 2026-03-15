import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon,
  className = '', 
  wrapperClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 
            transition-colors placeholder:text-slate-400 
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
