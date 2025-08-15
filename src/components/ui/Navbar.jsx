// Shadcn-style Navbar component with sticky positioning, backdrop blur and mobile hamburger menu
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ 
  logo, 
  logoText, 
  navigation = [], 
  onNavClick,
  currentHash,
  location,
  rightContent,
  className = ''
}) {
  return (
    <Disclosure as="nav" className={cn("sticky top-0 z-50 px-2 sm:px-6 lg:px-8 py-2", className)}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl">
            <div className="mt-2 rounded-3xl shadow-xl bg-white/90 backdrop-blur-md border border-white/20 flex h-16 sm:h-20 justify-between items-center px-4 sm:px-10 transition-all">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-shrink-0 group">
                  {logo && (
                    <img
                      src={logo}
                      alt={`${logoText} Logo`}
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-blue-200 shadow bg-white object-contain transition-transform group-hover:scale-105 group-hover:shadow-lg"
                    />
                  )}
                  {logoText && (
                    <span className="text-2xl sm:text-3xl font-heading font-extrabold text-primary tracking-tight drop-shadow-sm transition-colors group-hover:text-blue-500">
                      {logoText}
                    </span>
                  )}
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
                  {navigation.map((item) => {
                    let isActive = false;
                    
                    if (item.href === '/' && location?.pathname === '/') {
                      // Home is active if we're on home page and no hash is selected
                      isActive = !currentHash || currentHash === '';
                    } else if (item.href.startsWith('#') && location?.pathname === '/') {
                      // Hash links are active if the current hash matches and we're on home page
                      isActive = currentHash === item.href;
                    } else if (!item.href.startsWith('#') && item.href !== '/') {
                      // Regular routes are active if pathname matches (non-home routes)
                      isActive = location?.pathname === item.href;
                    }
                    
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={e => onNavClick?.(e, item.href)}
                        className={cn(
                          'relative px-5 py-2 rounded-2xl text-lg font-bold transition-all duration-150 font-heading tracking-tight',
                          isActive
                            ? 'text-blue-900 bg-blue-400 shadow border-b-4 border-blue-300'
                            : 'text-blue-700 hover:text-white hover:bg-blue-300/80 hover:shadow-md'
                        )}
                        style={{
                          boxShadow: isActive ? '0 2px 8px 0 rgba(59,130,246,0.15)' : undefined
                        }}
                      >
                        {item.name}
                        {isActive && (
                          <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-8 h-1 bg-blue-200 rounded-full"></span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
              
              {/* Right Content */}
              <div className="flex items-center gap-4">
                {rightContent}
                
                {/* Mobile menu button */}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-xl p-3 text-blue-400 hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-2 pb-3 pt-2 px-4 bg-white/95 backdrop-blur-sm rounded-b-3xl mx-2 shadow-lg border-x border-b border-white/20">
              {navigation.map((item) => {
                let isActive = false;
                
                if (item.href === '/' && location?.pathname === '/') {
                  // Home is active if we're on home page and no hash is selected
                  isActive = !currentHash || currentHash === '';
                } else if (item.href.startsWith('#') && location?.pathname === '/') {
                  // Hash links are active if the current hash matches and we're on home page
                  isActive = currentHash === item.href;
                } else if (!item.href.startsWith('#') && item.href !== '/') {
                  // Regular routes are active if pathname matches (non-home routes)
                  isActive = location?.pathname === item.href;
                }
                
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={e => onNavClick?.(e, item.href)}
                    className={cn(
                      'block border-l-4 py-3 pl-4 pr-4 text-lg font-bold rounded-2xl transition-all duration-150 font-heading tracking-tight',
                      isActive
                        ? 'border-blue-400 bg-white text-blue-700 shadow'
                        : 'border-transparent text-blue-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                    )}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
