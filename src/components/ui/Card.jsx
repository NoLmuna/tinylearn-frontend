// Shadcn-style Card component with rounded corners, white border, shadow and hover effects
import React from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Card({ 
  children, 
  image, 
  alt, 
  elevate = false,
  className = '',
  ...props 
}) {
  const cardClasses = cn(
    'bg-white rounded-2xl border-4 border-white shadow-card p-6 overflow-hidden',
    elevate && 'card-hover cursor-pointer',
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {image && (
        <div className="mb-4 -mx-6 -mt-6">
          <img 
            src={image} 
            alt={alt || 'Card image'} 
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      {children}
    </div>
  );
}
