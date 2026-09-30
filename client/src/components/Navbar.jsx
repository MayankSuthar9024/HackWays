import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, Shield, Menu, X, Calendar, User, Compass } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-primary text-white border-b border-white/10 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-secondary text-primary flex items-center justify-center font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-tight text-white">
                HACKWAYS
              </span>
              <span className="text-[11px] text-secondary tracking-wider uppercase block font-medium">
                Innovation & Events Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events') ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Events
            </Link>

            {user && !isAdmin && (
              <Link
                to="/my-events"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/my-events') ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                My Events
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="px-3.5 py-2 rounded-lg text-sm font-medium bg-secondary text-primary hover:bg-secondary-hover transition-colors inline-flex items-center gap-1.5 ml-2"
              >
                <Shield className="w-4 h-4 text-accent" />
                Admin Panel
              </Link>
            )}
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
                  <span className="text-white max-w-[120px] truncate">{user.name}</span>
                  {isAdmin && (
                    <span className="bg-secondary text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Admin
                    </span>
                  )}
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-primary hover:bg-secondary-hover transition-colors shadow-sm"
                >
                  Login / Sign Up
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
          >
            Events
          </Link>

          {user && !isAdmin && (
            <Link
              to="/my-events"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
            >
              My Events
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium bg-secondary text-primary"
            >
              Admin Dashboard
            </Link>
          )}

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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-secondary text-primary rounded-lg font-semibold"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
