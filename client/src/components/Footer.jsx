import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Globe, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About Org */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="font-bold text-lg text-white">HACKWAYS</span>
            </div>
            <p className="text-white/70 text-sm max-w-md leading-relaxed">
              Empowering innovators, students, and engineers through collaborative hackathons, ideathons, and technical challenges. Building the future one prototype at a time.
            </p>
            <div className="flex items-center gap-4 text-xs text-secondary">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Official Events Portal
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <a
                  href="/#"
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#hackathon"
                  onClick={(e) => {
                    const el = document.getElementById('hackathon');
                    if (el && window.location.pathname === '/') {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Hackathon
                </a>
              </li>
              <li>
                <a
                  href="/#prizes"
                  onClick={(e) => {
                    const el = document.getElementById('prizes');
                    if (el && window.location.pathname === '/') {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Prizes
                </a>
              </li>
              <li>
                <a
                  href="/#how-to-register"
                  onClick={(e) => {
                    const el = document.getElementById('how-to-register');
                    if (el && window.location.pathname === '/') {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  How To register
                </a>
              </li>
              <li>
                <a
                  href="/#about"
                  onClick={(e) => {
                    const el = document.getElementById('about');
                    if (el && window.location.pathname === '/') {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">Contact & Support</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="mailto:support@hackways.com" className="hover:text-white transition-colors">
                  support@hackways.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="https://hackways.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  hackways.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Chartered Institute of Technology, Abu Road</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Hackways. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white cursor-pointer transition-colors">
              Terms of Participation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
