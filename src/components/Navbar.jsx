import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/levelup-logo.png';

/**
 * Navbar Component
 * Modern navigation bar with responsive design
 */
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo}
              alt="Level Up Learning Center - TinyLearn" 
              className="h-16 w-16 object-contain"
            />
            <span className="text-2xl font-black text-black">TinyLearn</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#home" className="text-black hover:text-[#F4C21A] font-semibold transition-colors">
              Home
            </a>
            <a href="/#features" className="text-black hover:text-[#F4C21A] font-semibold transition-colors">
              Features
            </a>
            <a href="/#about" className="text-black hover:text-[#F4C21A] font-semibold transition-colors">
              About
            </a>
            <a href="/#contact" className="text-black hover:text-[#F4C21A] font-semibold transition-colors">
              Contact
            </a>
            <Link
              to="/login"
              className="px-6 py-2 bg-[#F4C21A] text-black rounded-xl font-bold hover:bg-[#e0b318] transition-colors shadow-md"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-black hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="/#home"
              className="block px-3 py-2 rounded-md text-black hover:bg-[#FFF9E6] font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/#features"
              className="block px-3 py-2 rounded-md text-black hover:bg-[#FFF9E6] font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/#about"
              className="block px-3 py-2 rounded-md text-black hover:bg-[#FFF9E6] font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/#contact"
              className="block px-3 py-2 rounded-md text-black hover:bg-[#FFF9E6] font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Link
              to="/login"
              className="block mx-3 my-2 px-6 py-2 bg-[#F4C21A] text-black rounded-xl font-bold hover:bg-[#e0b318] transition-colors text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
