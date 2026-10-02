import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (sectionId === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-primary/85 backdrop-blur-md text-white border-b border-white/10 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name using the official Hackways Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 mr-4">
            <img
              src="/hackways-logo.jpg"
              alt="Hackways"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-sm border border-white/20 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="font-black text-base sm:text-lg tracking-wider block leading-none text-white">
                HACKWAYS
              </span>
              <span className="text-[9px] sm:text-[10px] text-secondary tracking-widest uppercase block font-semibold mt-1">
                MSME Certified
              </span>
            </div>
          </Link>

          {/* Navigation: Exact 5 Links Requested */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => scrollToSection('home')}
              className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('hackathon')}
              className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Hackathon
            </button>
            <button
              onClick={() => scrollToSection('prizes')}
              className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Prizes
            </button>
            <button
              onClick={() => scrollToSection('how-to-register')}
              className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              How To register
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              About
            </button>
          </nav>

          {/* User Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-secondary" />
                  )}
                  <span className="text-white max-w-[140px] truncate">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-secondary text-primary hover:bg-secondary-hover transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer: Exact 5 Links Requested */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10 px-4 pt-3 pb-6 space-y-1.5">
          <button
            onClick={() => scrollToSection('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/10"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('hackathon')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
          >
            Hackathon
          </button>
          <button
            onClick={() => scrollToSection('prizes')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
          >
            Prizes
          </button>
          <button
            onClick={() => scrollToSection('how-to-register')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
          >
            How To register
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
          >
            About
          </button>

          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="text-xs text-white/70 px-3">
                  Signed in as <strong className="text-white">{user.name}</strong> ({user.email})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-secondary text-primary rounded-lg shadow-sm"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
