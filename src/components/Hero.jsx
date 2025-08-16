// Hero section component with pastel gradient background, heading, image and CTA buttons
import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

export default function Hero({
  title,
  subtitle,
  image,
  imageAlt,
  buttons = [],
  className = ''
}) {
  function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <section className={cn('hero-gradient min-h-[80vh] flex items-center justify-center', className)}>
      <div className="max-w-4xl mx-auto text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl sm:text-6xl font-heading font-extrabold text-primary mb-6 drop-shadow-sm leading-tight tracking-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-body font-medium">
            {subtitle}
          </p>
        )}
        
        {image && (
          <div className="flex justify-center mt-8 mb-12">
            <div className="w-full max-w-md">
              <img
                src={image}
                alt={imageAlt || 'Hero image'}
                className="rounded-2xl w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
            </div>
          </div>
        )}
        
        {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'primary'}
                size={button.size || 'lg'}
                icon={button.icon}
                onClick={button.onClick}
                className={cn('w-full sm:w-auto flex-1 py-5 text-xl', button.className)}
                style={{ minWidth: 140, ...button.style }}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
