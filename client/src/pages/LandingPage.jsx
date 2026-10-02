import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Award,
  Gift,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Cpu,
  Calendar,
  Coffee,
  Check,
  Building,
  Terminal,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  FileText,
  BadgeCheck,
  Layers,
  Banknote,
  Send,
  Laptop,
  Wifi,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';

const PARTNERS = [
  {
    name: 'Chartered Institute of Technology',
    logo: (
      <img
        src="/cit-logo.png"
        alt="Chartered Institute of Technology (CIT)"
        className="h-11 sm:h-13 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] brightness-110 contrast-105"
      />
    ),
  },
  {
    name: 'Google Cloud',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 160 32" fill="none">
        <path fill="#4285F4" d="M19.8 14.5c0-.6-.05-1.2-.16-1.8H10v3.4h5.5c-.24 1.3-.98 2.4-2.07 3.1v2.6h3.35c1.96-1.8 3.02-4.5 3.02-7.3z" />
        <path fill="#34A853" d="M10 24.5c2.8 0 5.15-.9 6.87-2.5l-3.35-2.6c-.93.6-2.12 1-3.52 1-2.7 0-5-1.8-5.8-4.3H.7v2.7C2.4 22.2 5.9 24.5 10 24.5z" />
        <path fill="#FBBC05" d="M4.2 16.1c-.2-.6-.3-1.3-.3-2.1s.1-1.5.3-2.1V9.2H.7C.2 10.2 0 11.3 0 12.5s.2 2.3.7 3.3l3.5-2.7z" />
        <path fill="#EA4335" d="M10 4.5c1.5 0 2.9.5 4 1.5l3-3C15.1 1.2 12.7 0 10 0 5.9 0 2.4 2.3.7 5.8l3.5 2.7c.8-2.5 3.1-4 5.8-4z" />
        <text x="26" y="21" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="600" letterSpacing="-0.3px">Google Cloud</text>
      </svg>
    ),
  },
  {
    name: 'Amazon Web Services',
    logo: (
      <svg className="h-7 sm:h-8 w-auto text-[#FF9900]" viewBox="0 0 85 32" fill="currentColor">
        <text x="2" y="21" fill="#FF9900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="900" letterSpacing="0.5px">aws</text>
        <path d="M4 26.5c14 4.5 30 4.5 44 0 .5-.2.9.3.6.7-11 6-30 6-45.2-.2-.5-.3-.1-.7.6-.5z" fill="#FF9900" />
        <path d="M46.5 24c1.3-.8 3.2-2.8 3.7-4 .1-.2.4-.1.3.2-.3 1.2-1.3 2.9-2.6 4.3-.2.3-.6.1-.5-.2z" fill="#FF9900" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 110 32" fill="white">
        <path fillRule="evenodd" clipRule="evenodd" d="M13 3C6.37 3 1 8.37 1 15c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58C20.57 24.79 24 20.3 24 15c0-6.63-5.37-12-11-12z" />
        <text x="32" y="21" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="700" letterSpacing="-0.3px">GitHub</text>
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 120 32" fill="none">
        <rect x="0" y="5" width="10" height="10" fill="#F25022" />
        <rect x="12" y="5" width="10" height="10" fill="#7FBA00" />
        <rect x="0" y="17" width="10" height="10" fill="#00A4EF" />
        <rect x="12" y="17" width="10" height="10" fill="#FFB900" />
        <text x="30" y="21" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="600" letterSpacing="-0.2px">Microsoft</text>
      </svg>
    ),
  },
  {
    name: 'Intel Labs',
    logo: (
      <svg className="h-7 sm:h-8 w-auto text-[#00C7FD]" viewBox="0 0 65 32" fill="currentColor">
        <text x="0" y="23" fill="#00C7FD" fontFamily="system-ui, -apple-system, sans-serif" fontSize="23" fontWeight="900" letterSpacing="-1.2px">intel</text>
      </svg>
    ),
  },
  {
    name: 'Cisco Systems',
    logo: (
      <svg className="h-7 sm:h-8 w-auto text-[#00BCEB]" viewBox="0 0 92 32" fill="none">
        <g stroke="#00BCEB" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="18" x2="3" y2="23" />
          <line x1="8" y1="13" x2="8" y2="23" />
          <line x1="13" y1="8" x2="13" y2="23" />
          <line x1="18" y1="14" x2="18" y2="23" />
          <line x1="23" y1="8" x2="23" y2="23" />
          <line x1="28" y1="13" x2="28" y2="23" />
          <line x1="33" y1="18" x2="33" y2="23" />
        </g>
        <text x="41" y="21" fill="#00BCEB" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="800" letterSpacing="1px">CISCO</text>
      </svg>
    ),
  },
  {
    name: 'Docker',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 110 32" fill="none">
        <path fill="#2496ED" d="M16 11.5h2.4v-2.2H16v2.2zm-3.3-6.2h2.4V3.1h-2.4v2.2zm0 3.1h2.4V6.2h-2.4v2.2zm-3.3 0h2.4V6.2H9.4v2.2zm-3.3 0h2.4V6.2H6.1v2.2zm6.6 3.1h2.4v-2.2h-2.4v2.2zm-3.3 0h2.4v-2.2H9.4v2.2zm-3.3 0h2.4v-2.2H6.1v2.2zm-3.3 0h2.4v-2.2H2.8v2.2zm24.3-1.4c-.4-2.3-2.4-3.3-2.5-3.4l-.6-.3-.4.6c-.5.7-1.1 1.3-1.7 1.8-.4.3-.8.5-1.3.7-.2-.8-.7-1.6-1.4-2l-.5-.3-.4.5c-.5.7-.9 1.5-1.1 2.4H1.3c-.7 0-1.3.6-1.3 1.3 0 .5.2 1 .5 1.4C2.8 19 8.1 22 14.1 22c8.2 0 12.6-5.7 12.6-11.4 0-.1 0-.3 0-.4z" />
        <text x="32" y="21" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="700" letterSpacing="-0.2px">docker</text>
      </svg>
    ),
  },
  {
    name: 'Postman',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 120 32" fill="none">
        <circle cx="12" cy="16" r="10" fill="#FF6C37" />
        <path d="M12 9.5v6.5l4.5 2.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="29" y="21" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="800" letterSpacing="0.2px">POSTMAN</text>
      </svg>
    ),
  },
  {
    name: 'DigitalOcean',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 145 32" fill="none">
        <path fill="#0080FF" d="M13.6 3c-6.6 0-12 5.4-12 12s5.4 12 12 12c4.6 0 8.6-2.6 10.6-6.4l-3.3-.8c-1.4 2.7-4.2 4.6-7.3 4.6-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c3.1 0 5.9 1.9 7.3 4.6l3.3-.8C22.2 5.6 18.2 3 13.6 3z" />
        <rect x="19" y="16" width="3.5" height="3.5" fill="#0080FF" />
        <rect x="23.5" y="16" width="3" height="3" fill="#0080FF" />
        <rect x="19" y="20.5" width="3.5" height="3.5" fill="#0080FF" />
        <text x="32" y="21" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="700" letterSpacing="-0.2px">DigitalOcean</text>
      </svg>
    ),
  },
  {
    name: 'Stripe',
    logo: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 75 32" fill="none">
        <text x="0" y="23" fill="#635BFF" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-0.8px">stripe</text>
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-dark selection:bg-secondary selection:text-primary">
      {/* 1. HERO SECTION: CIT CODING CARNIVAL */}
      <section className="relative overflow-hidden bg-primary text-white pt-16 pb-14 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 border-b border-accent/20">
        {/* Decorative subtle ambient lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-6">
            {/* Organizer Tagline */}
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-secondary">
              Hackways • MSME Certified Organization • In Association with CIT
            </p>

            {/* Main Title */}
            <h1 className="text-3xl min-[420px]:text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              CIT Coding <br />
              <span className="text-secondary bg-gradient-to-r from-secondary via-white to-secondary bg-clip-text text-transparent">
                Carnival 2026
              </span>
            </h1>

            {/* Simple Subtitle */}
            <div className="space-y-3">
              <p className="text-xl sm:text-2xl font-bold text-white/95 tracking-tight">
                Ready to build something real?
              </p>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal max-w-2xl">
                Hackways, an MSME Certified Organization, is organizing a one-day Open Innovation Hackathon in association with Chartered Institute of Technology (CIT). Bring your idea, form your team of 4, build your prototype, and win exciting cash prizes!
              </p>
            </div>

            {/* Symmetrical Solid Key Highlights (No Glass) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-2 max-w-4xl">
              {/* 1. Teams */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</p>
                  <p className="text-sm sm:text-base font-extrabold text-primary leading-tight truncate">70 Teams</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-gray-600 mt-0.5 truncate">4 Members / Team</p>
                </div>
              </div>

              {/* 2. Prize Pool */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Rewards</p>
                  <p className="text-sm sm:text-base font-extrabold text-primary leading-tight truncate">₹25,000+</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-gray-600 mt-0.5 truncate">Cash Prize Pool</p>
                </div>
              </div>

              {/* 3. Venue */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-rose-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="text-sm sm:text-base font-extrabold text-primary leading-tight truncate">CIT Campus</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-gray-600 mt-0.5 truncate">Abu Road, Rajasthan</p>
                </div>
              </div>

              {/* 4. Refund Guarantee */}
              <div className="bg-[#EBF7EE] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">100% Refund</p>
                  <p className="text-sm sm:text-base font-extrabold text-emerald-950 leading-tight truncate">₹99 Entry</p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-emerald-700 mt-0.5 truncate">Refunded at Event</p>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/login"
                className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-9 py-4 rounded-xl shadow-card transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2.5 text-base"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5 text-accent" />
              </Link>
            </div>

            {/* Capacity Notice */}
            <p className="text-xs sm:text-sm font-semibold text-secondary tracking-wide pt-1">
              Limited Capacity: Only 70 Teams Allowed. Registrations close as soon as 70 slots are full!
            </p>
          </div>
        </div>

        {/* FULL-WIDTH PARTNER & SPONSOR LOGO STRIP */}
        <div className="w-full mt-16 pt-8 border-t border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Our Trusted Partners <span className="text-secondary">&amp; Global Sponsors</span>
            </h3>
          </div>

          <div className="relative w-full overflow-hidden py-3">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-primary to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-primary to-transparent pointer-events-none" />

            <div className="animate-marquee flex items-center gap-12 sm:gap-16 lg:gap-20">
              {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                <div
                  key={idx}
                  title={partner.name}
                  className="flex items-center justify-center flex-shrink-0 opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer select-none"
                >
                  {partner.logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SUMMARY STRIP */}
      <section className="bg-background-cream border-b border-accent/15 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">70 Teams</div>
              <div className="text-xs font-semibold text-accent uppercase tracking-wider">Capped Intake</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">₹25,000+</div>
              <div className="text-xs font-semibold text-accent uppercase tracking-wider">Cash Prizes</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">₹99 Refunded</div>
              <div className="text-xs font-semibold text-accent uppercase tracking-wider">100% at Check-in</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">Full Day</div>
              <div className="text-xs font-semibold text-accent uppercase tracking-wider">9:00 AM – 8:30 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED HACKATHON SECTION: WHAT IS GOING TO HAPPEN */}
      <section className="py-20 bg-background border-b border-accent/15" id="hackathon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Event Overview
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              What Is CIT Coding Carnival 2026?
            </h2>
            <p className="text-base text-dark-muted leading-relaxed">
              A 1-day offline Open Innovation Hackathon where 70 student teams gather at CIT Campus to build, test, and pitch prototype solutions to real-world problems.
            </p>
          </div>

          {/* 4 Core Pillars of the Hackathon */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">1. Open Innovation</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Bring any idea you are passionate about. Build web applications, mobile apps, AI tools, or IoT projects using whatever tech stack you like.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">2. Team Collaboration</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Work as a unit of 4 members. High-speed campus Wi-Fi, power ports, quiet coding labs, and continuous snacks keep your team productive all day.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">3. Mentorship Rounds</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Software industry veterans and faculty mentors visit your table to help fix bugs, review your architecture, and optimize your solution.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">4. Live Pitch & Win</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Present your working prototype directly to the jury panel. Win from the ₹25,000+ cash prize pool and take home verified certificates.
              </p>
            </div>
          </div>

          {/* Quick Schedule Flow Card */}
          <div className="bg-background-cream p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-accent/15">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-accent/15">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Day Flow</span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary">What The Event Day Looks Like</h3>
              </div>
              <span className="text-xs font-bold text-dark-muted bg-white px-3.5 py-1.5 rounded-lg border border-accent/15 shadow-2xs self-start md:self-auto">
                9:00 AM – 8:30 PM • 1 Single Day
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-center">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-accent/10 space-y-1">
                <div className="text-xs font-black text-accent">09:00 AM</div>
                <div className="text-xs font-bold text-primary leading-tight">Arrival & Check-in</div>
                <div className="text-[10px] text-emerald-700 font-semibold">₹99 Refund Given</div>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl border border-accent/10 space-y-1">
                <div className="text-xs font-black text-accent">10:00 AM</div>
                <div className="text-xs font-bold text-primary leading-tight">Opening Ceremony</div>
                <div className="text-[10px] text-dark-muted">Hacking Begins!</div>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl border border-accent/10 space-y-1">
                <div className="text-xs font-black text-accent">01:30 PM</div>
                <div className="text-xs font-bold text-primary leading-tight">Lunch & Mentors</div>
                <div className="text-[10px] text-dark-muted">Mentorship Round 1</div>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl border border-accent/10 space-y-1">
                <div className="text-xs font-black text-accent">05:30 PM</div>
                <div className="text-xs font-bold text-primary leading-tight">Code Freeze</div>
                <div className="text-[10px] text-dark-muted">Submit Project</div>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl border border-accent/10 space-y-1">
                <div className="text-xs font-black text-accent">06:00 PM</div>
                <div className="text-xs font-bold text-primary leading-tight">Live Demos</div>
                <div className="text-[10px] text-dark-muted">Judging & Pitching</div>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl border border-accent/10 space-y-1">
                <div className="text-xs font-black text-accent">08:00 PM</div>
                <div className="text-xs font-bold text-primary leading-tight">Award Ceremony</div>
                <div className="text-[10px] text-amber-700 font-bold">₹25,000+ Prizes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 1: THE CASH PRIZES */}
      <section className="py-20 bg-background border-b border-accent/15" id="prizes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Cash Prizes & Awards
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Win From A ₹25,000+ Cash Prize Pool
            </h2>
            <p className="text-base text-dark-muted leading-relaxed">
              We reward student innovation with real cash prizes. All awards are handed over directly to the winning teams at the closing ceremony on the event day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1st Prize */}
            <div className="card bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-secondary/60 shadow-card relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">1st Place Winner</span>
                  <div className="text-3xl sm:text-4xl font-black text-primary mt-1">₹15,000</div>
                  <p className="text-xs text-dark-muted font-medium mt-1">Direct Cash Prize for the Champion Team</p>
                </div>
                <ul className="space-y-2.5 pt-3 border-t border-accent/10 text-xs sm:text-sm text-dark">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Official Champion Trophy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Certificate of Excellence (MSME & CIT)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Exclusive Winner Swag Kit</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-secondary/20 rounded-xl text-center text-xs font-bold text-primary">
                Champion of CIT Coding Carnival
              </div>
            </div>

            {/* 2nd Prize */}
            <div className="card bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/15 shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-500/10 text-slate-700 flex items-center justify-center">
                  <Award className="w-8 h-8 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">2nd Place Runner-Up</span>
                  <div className="text-3xl sm:text-4xl font-black text-primary mt-1">₹7,000</div>
                  <p className="text-xs text-dark-muted font-medium mt-1">Direct Cash Prize for the 2nd Position</p>
                </div>
                <ul className="space-y-2.5 pt-3 border-t border-accent/10 text-xs sm:text-sm text-dark">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Runner-Up Trophy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Certificate of Merit (MSME & CIT)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Developer Goodies & Merch</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-background-cream rounded-xl text-center text-xs font-bold text-accent">
                2nd Place Honors
              </div>
            </div>

            {/* 3rd Prize / Innovation */}
            <div className="card bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/15 shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-700/10 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">3rd Place Innovation</span>
                  <div className="text-3xl sm:text-4xl font-black text-primary mt-1">₹3,000</div>
                  <p className="text-xs text-dark-muted font-medium mt-1">Direct Cash Prize for Best Innovation</p>
                </div>
                <ul className="space-y-2.5 pt-3 border-t border-accent/10 text-xs sm:text-sm text-dark">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Innovation Award Trophy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Special Category Certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Partner Cloud Credits & Perks</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-background-cream rounded-xl text-center text-xs font-bold text-accent">
                3rd Place Honors
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 2: THE ₹99 REFUND GUARANTEE */}
      <section className="py-20 bg-background-cream/70 border-b border-accent/15" id="refund">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-emerald-600/30 p-5 sm:p-8 md:p-12 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  100% Refundable Deposit
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight leading-tight">
                  Why Do We Charge ₹99? <br />
                  <span className="text-emerald-700">And How Do You Get It Back?</span>
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-dark-muted leading-relaxed">
                  <p>
                    <strong className="text-dark">1. Why the fee exists:</strong> Free hackathons often get flooded with fake registrations where teams don't show up. Because we only have room for 70 teams in the campus labs, the nominal ₹99 deposit guarantees that only serious students register.
                  </p>
                  <p>
                    <strong className="text-dark">2. Instant 100% Refund:</strong> The moment your team arrives and checks in at the CIT registration counter on the event morning, your ₹99 is handed back to you in cash or sent directly via UPI.
                  </p>
                  <p>
                    <strong className="text-dark">3. Completely free for you:</strong> If your team attends, the event costs you ₹0. Breakfast, lunch, Wi-Fi, mentorship, and goodies are all completely free!
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 sm:p-8 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-black text-primary">₹0 Net Cost</div>
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider">Zero Financial Risk for Teams</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-accent/15 text-xs text-dark space-y-2 text-left">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Pay ₹99 online to lock your team's slot</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Arrive at CIT Campus at 9:00 AM on event day</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Receive instant ₹99 cash/UPI refund at check-in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 3: TEAM & PARTICIPATION RULES */}
      <section className="py-20 bg-background border-b border-accent/15" id="rules">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Eligibility & Guidelines
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Team Rules & Who Can Participate
            </h2>
            <p className="text-base text-dark-muted leading-relaxed">
              Everything you need to know before registering. No confusing fine print — just 4 simple rules!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">Exactly 4 Members</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Every team must consist of exactly 4 students. You can team up with your friends, batchmates, or students from other departments.
              </p>
            </div>

            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">Strictly 70 Teams Cap</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                To ensure every team gets proper desks, power sockets, Wi-Fi, and food, entries are hard-capped at 70 teams. Once full, registration stops.
              </p>
            </div>

            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">Bring Your Laptops</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Every member should carry their laptop, chargers, and any hardware/Arduino/sensors needed. We provide high-speed Wi-Fi and power extensions.
              </p>
            </div>

            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">Open to All Students</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Whether you are in 1st year or 4th year, BCA, B.Tech, MCA, or diploma — all enthusiastic college students are welcome to participate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 4: CERTIFICATES & SWAG FOR ALL */}
      <section className="py-20 bg-background-cream/70 border-b border-accent/15" id="perks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Guaranteed For All Participants
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Certificates & Goodies For Every Single Student
            </h2>
            <p className="text-base text-dark-muted leading-relaxed">
              Nobody leaves empty-handed. Every student who attends gains valuable credentials and official festival perks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/15 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-primary">Official Participation Certificate</h3>
              <p className="text-sm text-dark-muted leading-relaxed">
                Every single participant receives a verified Certificate of Participation co-signed by Hackways (Government of India MSME Certified Organization) and Chartered Institute of Technology (CIT).
              </p>
              <div className="space-y-2 pt-2 text-xs sm:text-sm text-dark">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Valid for college submission, resumes, and LinkedIn profiles</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified with individual credential IDs co-signed by CIT leadership</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/15 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-xl text-primary">Swag & Goodie Kits</h3>
              <p className="text-sm text-dark-muted leading-relaxed">
                When you check in at the morning counter, each member gets an official CIT Coding Carnival participant package.
              </p>
              <div className="space-y-2 pt-2 text-xs sm:text-sm text-dark">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>High-quality vinyl developer stickers for your laptop</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Official event badges, lanyards, and partner cloud vouchers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 5: MENTORS & BEGINNER FRIENDLINESS */}
      <section className="py-20 bg-background border-b border-accent/15" id="mentors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-card relative overflow-hidden">
            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-white/10 text-secondary text-xs font-bold uppercase tracking-wider">
                Beginner Friendly Environment
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                First Time In A Hackathon? <br />
                <span className="text-secondary">Our Mentors Are Here To Guide You!</span>
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                You don't need to be a coding genius to join. Experienced industry developers and faculty mentors will be on the floor the entire day.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="font-bold text-white text-base">Stuck on a Bug or Code Error?</div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Just call a mentor to your table! They will sit with your team, help you debug errors, connect APIs, and keep your build moving forward.
                  </p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="font-bold text-white text-base">Fair & Encouraging Evaluation</div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Judges grade you on your effort, creative thinking, and live working demo. Even simple, practical projects have won top prizes!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 6: VENUE, TIMING & FOOD */}
      <section className="py-20 bg-background-cream/70 border-b border-accent/15" id="venue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Hospitality & Campus Facilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Venue, Timings & Food (Full Day Sprint)
            </h2>
            <p className="text-base text-dark-muted leading-relaxed">
              We provide everything so your team can focus 100% on coding and building your prototype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">CIT Campus, Abu Road</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Chartered Institute of Technology, NH-14, Abu Road, Rajasthan. Safe, green, modern engineering campus with spacious computer laboratories.
              </p>
            </div>

            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">9:00 AM – 8:30 PM</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                A single-day sprint! Arrive by 9:00 AM for breakfast and check-in. Coding starts at 10:30 AM, submissions lock at 5:30 PM, and prizes are awarded by 8:30 PM.
              </p>
            </div>

            <div className="card bg-white p-7 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-primary">Meals & High-Speed Wi-Fi</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Morning breakfast, afternoon hot lunch, evening refreshments, and unlimited tea/coffee provided on the house. Dedicated team tables with power sockets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 7: WHAT CAN YOU BUILD? (OPEN INNOVATION) */}
      <section className="py-20 bg-background border-b border-accent/15" id="tracks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Open Innovation Ideas
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              What Can Your Team Build?
            </h2>
            <p className="text-base text-dark-muted leading-relaxed">
              This is an Open Innovation hackathon! You are free to bring your own idea or choose from popular problem areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-white p-6 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">AI & Smart Apps</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                AI chatbots, smart homework helpers, document summarizers, or computer vision detection tools.
              </p>
            </div>

            <div className="card bg-white p-6 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">Campus & Student Utilities</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Lost-and-found apps, student notes marketplace, canteen ordering, hostel room management, or attendance tools.
              </p>
            </div>

            <div className="card bg-white p-6 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">Web & Mobile Apps</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                E-commerce stores, healthcare appointment booking, local community helper apps, or emergency alert systems.
              </p>
            </div>

            <div className="card bg-white p-6 rounded-2xl border border-accent/15 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">Open Community Track</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Have your own unique idea? You have complete freedom to build any software or hardware solution that solves a real problem!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 8: SIMPLE 4-STEP REGISTRATION */}
      <section className="py-20 bg-background-cream/70 border-b border-accent/15" id="how-to-register">
        <span id="schedule" className="sr-only" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Step-by-Step
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              How To Join In 4 Easy Steps
            </h2>
            <p className="text-base text-dark-muted">
              Registering your team takes less than 2 minutes!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative space-y-3">
              <div className="text-3xl font-black text-secondary">01</div>
              <h3 className="font-bold text-base text-primary">Form Your Team</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Gather 4 friends or classmates who want to build and learn together. Choose a cool team name!
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative space-y-3">
              <div className="text-3xl font-black text-secondary">02</div>
              <h3 className="font-bold text-base text-primary">Register Online</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Click Register, enter your 4 member names and contact details, and pay the ₹99 refundable commitment fee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative space-y-3">
              <div className="text-3xl font-black text-secondary">03</div>
              <h3 className="font-bold text-base text-primary">Arrive & Get Refund</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Reach CIT Campus by 9:00 AM on the event day. Check in at the desk, collect your goodie bag, and get your ₹99 refunded!
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative space-y-3">
              <div className="text-3xl font-black text-secondary">04</div>
              <h3 className="font-bold text-base text-primary">Code, Build & Win</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Build your project with mentor help, demonstrate your prototype to the judges, and take home cash prizes & certificates!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 9: ABOUT THE ORGANIZERS (HACKWAYS & CIT) */}
      <section className="py-20 bg-background border-b border-accent/15" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Official Organizing Body
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Organized By Hackways <br />
              <span className="text-primary font-bold text-2xl sm:text-3xl">In Association with CIT</span>
            </h2>
            <p className="text-sm sm:text-base text-dark-muted leading-relaxed">
              Hackways is an official Government of India <strong>MSME Certified Organization</strong>. We build professional hackathon software and manage high-quality student competitions across colleges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* 1. MSME Govt Certified Card (Same size as CIT) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/15 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <img
                src="/msme-logo.svg"
                alt="Ministry of MSME, Govt. of India"
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain filter drop-shadow shrink-0"
              />
              <div className="space-y-2">
                <div className="text-xs font-bold text-accent">Government of India Recognized</div>
                <h3 className="font-extrabold text-lg text-primary">Certified by Ministry of MSME</h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Official Government of India MSME Certified Organization. Verified digital certificates verifiable online on LinkedIn and resumes.
                </p>
                <div className="text-xs font-bold text-emerald-700 pt-1">
                  Organizing Partner • MSME Certified
                </div>
              </div>
            </div>

            {/* 2. CIT Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/15 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <img
                src="/cit-logo.png"
                alt="Chartered Institute of Technology"
                className="h-16 w-auto sm:h-20 md:h-24 object-contain filter drop-shadow shrink-0"
              />
              <div className="space-y-2">
                <div className="text-xs font-bold text-accent">Host Institution</div>
                <h3 className="font-extrabold text-lg text-primary">Chartered Institute of Technology</h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Premier engineering & technical institution in Abu Road, providing top-class computing infrastructure, lab facilities, and campus hospitality for CIT Coding Carnival 2026.
                </p>
                <div className="text-xs font-bold text-accent pt-1">
                  Venue Partner • CIT Campus, Abu Road
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION: READY FOR CIT CODING CARNIVAL */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 translate-y-1/3" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary">
            Strict Limit: Only 70 Teams Allowed
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready For CIT Coding Carnival?
          </h2>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Form your team of 4 members, bring your laptop, and build your prototype! Registration is only ₹99 and 100% refunded when you arrive at the CIT Campus.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-9 py-4 rounded-xl shadow-card transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2.5 text-base"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5 text-accent" />
            </Link>
          </div>

          <p className="text-xs text-white/50 pt-2">
            Organized by Hackways (MSME Certified) in association with Chartered Institute of Technology
          </p>
        </div>
      </section>
    </div>
  );
}
