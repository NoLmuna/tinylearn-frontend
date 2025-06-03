import React, { Fragment, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/levelup-logo.png';

// Public navigation
const publicNav = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

// Private navigation (for logged-in users)
const privateNav = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Lessons', href: '/lessons' },
];

export default function MainLayout() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Simulate user login after successful login/signup (for demo only)
  useEffect(() => {
    if (location.pathname === '/dashboard' && !user) {
      setUser({ name: 'Demo User', role: 'student' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const navigation = user ? privateNav : publicNav;

  // Smooth scroll for anchor links
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(href.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.location.hash = href;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Disclosure as="nav" className="sticky top-0 z-50 px-2 sm:px-6 lg:px-8 py-2">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl">
              <div className="mt-2 rounded-3xl shadow-xl bg-gradient-to-r from-pink-100 via-yellow-100 to-sky-100 border border-white flex h-16 sm:h-20 justify-between items-center px-4 sm:px-10 transition-all">
                <div className="flex items-center gap-4">
                  <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                    <img
                      src={logo}
                      alt="Level Up Learning Center Logo"
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-pink-200 shadow bg-white object-contain transition-transform group-hover:scale-105 group-hover:shadow-lg"
                    />
                    <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight drop-shadow-sm transition-colors group-hover:text-pink-500 font-[Fredoka]">
                      TinyLearn
                    </span>
                  </Link>
                  <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
                    {navigation.map((item) => {
                      const isActive =
                        (item.href === '/' && location.pathname === '/' && !currentHash) ||
                        (item.href.startsWith('#') && currentHash === item.href);
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={e => handleNavClick(e, item.href)}
                          className={`relative px-5 py-2 rounded-2xl text-lg font-bold transition-all duration-150 font-[Fredoka] tracking-tight
                            ${
                              isActive
                                ? 'text-yellow-900 bg-yellow-400 shadow border-b-4 border-yellow-300'
                                : 'text-yellow-700 hover:text-white hover:bg-yellow-300/80 hover:shadow-md'
                            }
                          `}
                          style={{
                            boxShadow: isActive ? '0 2px 8px 0 rgba(251,191,36,0.15)' : undefined
                          }}
                        >
                          {item.name}
                          {isActive && (
                            <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-8 h-1 bg-yellow-200 rounded-full"></span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
                {/* Right side: Get Started button for public, user info for logged in */}
                {!user ? (
                  <a
                    href="/signup"
                    className="hidden sm:inline-block px-8 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 text-pink-900 font-extrabold shadow hover:from-yellow-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 transition-all text-lg font-[Fredoka]"
                  >
                    Get Started
                  </a>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-lg font-bold text-pink-700 font-[Fredoka]">{user.name}</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-200 text-pink-700 text-base font-bold capitalize font-[Fredoka]">{user.role}</span>
                    <button
                      onClick={() => setUser(null)}
                      className="px-4 py-2 rounded-xl text-base font-bold text-pink-600 border border-pink-200 bg-white hover:bg-pink-100 transition-colors font-[Fredoka]"
                    >
                      Logout
                    </button>
                  </div>
                )}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-xl p-3 text-pink-400 hover:bg-pink-100 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-400">
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

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-2 pb-3 pt-2 px-4">
                {navigation.map((item) => {
                  const isActive =
                    (item.href === '/' && location.pathname === '/' && !currentHash) ||
                    (item.href.startsWith('#') && currentHash === item.href);
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={e => handleNavClick(e, item.href)}
                      className={`block border-l-4 py-3 pl-4 pr-4 text-lg font-bold rounded-2xl transition-all duration-150 font-[Fredoka] tracking-tight
                        ${
                          isActive
                            ? 'border-yellow-400 bg-white text-yellow-700 shadow'
                            : 'border-transparent text-yellow-600 hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700'
                        }
                      `}
                    >
                      {item.name}
                    </a>
                  );
                })}
                {!user && (
                  <a
                    href="/signup"
                    className="block mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 text-pink-900 font-extrabold shadow hover:from-yellow-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 transition-all text-lg text-center font-[Fredoka]"
                  >
                    Get Started
                  </a>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="min-h-[calc(100vh-5rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 