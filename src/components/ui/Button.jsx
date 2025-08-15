// Reusable shadcn-style Button component with variants, sizes and accessibility features
import React from 'react';

const buttonVariants = {
  primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-button button-lift hover:from-blue-600 hover:to-blue-700 focus:ring-blue-200',
  secondary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-button button-lift hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-200',
  accent: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-button button-lift hover:from-purple-600 hover:to-purple-700 focus:ring-purple-200',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
  outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200'
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
      {children}
    </button>
  );
}
