// Main layout component with navbar, routing and user authentication state
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
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

const roleBasedNav = {
  student: [
    { name: 'Dashboard', href: '/student' },
    { name: 'Lessons', href: '/lessons' },
  ],
  parent: [
    { name: 'Dashboard', href: '/parent' },
    { name: 'Child Progress', href: '/parent/progress' },
  ],
  tutor: [
    { name: 'Dashboard', href: '/tutor' },
    { name: 'Students', href: '/tutor/students' },
  ],
};

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Update navigation based on path and auth state
  const navigation = user 
    ? (location.pathname === '/' 
      ? publicNav 
      : (roleBasedNav[user.role] || privateNav))
    : publicNav;

  // Smooth scroll for anchor links
  const handleNavClick = (e, href) => {
    if (!href.startsWith('#')) {
      e.preventDefault();
      navigate(href);
    } else {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(href.replace('#', ''));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            window.location.hash = href;
          }
        }, 100);
      } else {
        const el = document.getElementById(href.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.location.hash = href;
        }
      }
    }
  };

  // Right side content for navbar
  const rightContent = !user ? (
    <Link to="/signup" className="hidden sm:inline-block">
      <Button variant="primary" size="lg" className="font-heading">
        Get Started
      </Button>
    </Link>
  ) : (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-lg font-bold text-pink-700 font-heading">{user.name}</span>
      <span className="inline-block px-3 py-1 rounded-full bg-pink-200 text-pink-700 text-base font-bold capitalize font-heading">{user.role}</span>
      <Button
        variant="outline"
        size="sm" 
        onClick={handleLogout}
        className="font-heading"
      >
        Logout
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        logo={logo}
        logoText="TinyLearn"
        navigation={navigation}
        onNavClick={handleNavClick}
        currentHash={currentHash}
        location={location}
        rightContent={rightContent}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="min-h-[calc(100vh-5rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
