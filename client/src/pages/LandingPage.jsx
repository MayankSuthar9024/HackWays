import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  Award,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

const PARTNERS = [
  {
    name: 'Google Cloud',
    category: 'Cloud Infrastructure',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.87c2.26-2.09 3.67-5.17 3.67-9.12z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.12C3.26 21.36 7.35 24 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4-3.12z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.27 6.61l4 3.12c.95-2.85 3.6-4.98 6.73-4.98z" />
      </svg>
    ),
  },
  {
    name: 'Microsoft Learn',
    category: 'Technology Partner',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 21 21">
        <rect x="0" y="0" width="10" height="10" fill="#F25022" />
        <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
        <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
        <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
  },
  {
    name: 'Amazon Web Services',
    category: 'Cloud & Compute',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.8 17.5c-2.4 1.8-5.8 2.7-8.8 2.7-4.2 0-7.9-1.6-10.7-4.2-.2-.2-.2-.5 0-.7.4-.4.8-.8 1.2-1.2.2-.2.5-.2.7 0 2.3 2.1 5.3 3.4 8.7 3.4 2.4 0 5.1-.7 7.2-2.1.3-.2.7-.1.9.2.2.3.4.7.6 1 .2.3.1.7-.1.9zm1.4-1.3c-.3-.4-1.9-.6-3.8-.4-.4 0-.5-.3-.2-.6 1.4-1.5 3.8-1.1 4.3-.4.5.7.1 3.2-1.3 4.6-.3.3-.6.1-.5-.3.4-1.1 1.7-2.6 1.5-2.9zM12 2C6.5 2 2 6.5 2 12c0 2.1.7 4.1 1.8 5.7 2.8 2.5 6.4 4.1 10.4 4.1 2.9 0 6.1-.9 8.4-2.5.3-.2.3-.6.1-.8-.4-.4-.8-.9-1.2-1.3-.2-.2-.5-.2-.7 0-2.1 1.4-4.7 2.1-7.1 2.1-3.3 0-6.3-1.2-8.5-3.3C4.2 14.6 3.6 12.8 3.6 11c0-4.6 3.8-8.4 8.4-8.4 4.6 0 8.4 3.8 8.4 8.4 0 .9-.1 1.7-.4 2.5-.1.3 0 .6.3.7.5.3 1 .5 1.5.8.3.1.6 0 .7-.3.4-1.2.6-2.4.6-3.7 0-5.5-4.5-10-10-10z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    category: 'Developer Ecosystem',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'Intel Labs',
    category: 'AI & Silicon',
    icon: (
      <span className="font-black text-xs tracking-tight text-[#00C7FD] lowercase leading-none">intel</span>
    ),
  },
  {
    name: 'Cisco Systems',
    category: 'Enterprise Networks',
    icon: (
      <svg className="w-3.5 h-3 flex-shrink-0 text-[#00BCEB]" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M2 10v3M5 6v10M8 2v14M12 7v7M16 2v14M19 6v10M22 10v3" />
      </svg>
    ),
  },
  {
    name: 'Docker',
    category: 'Container Platform',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.76 9.89c-.365-2.073-2.146-2.946-2.222-2.983l-.538-.266-.356.496c-.463.645-.98 1.155-1.543 1.546-.35.244-.73.447-1.127.607-.15-.745-.632-1.365-1.28-1.74l-.45-.262-.317.41c-.482.624-.81 1.345-.972 2.117H1.14c-.628 0-1.14.512-1.14 1.14 0 .445.14.887.41 1.258C2.5 17.5 7.18 20.25 12.56 20.25c7.34 0 11.23-5.02 11.23-10.02 0-.116-.01-.233-.03-.34" />
      </svg>
    ),
  },
  {
    name: 'Postman',
    category: 'API Development',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#FF6C37" />
        <path d="M12 6v6l4 2.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: 'DigitalOcean',
    category: 'Cloud Hosting',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#0080FF]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 0C5.408 0 .04 5.367.04 12c0 5.178 3.284 9.589 7.89 11.22l-.008-3.324c-2.85-.92-4.9-3.565-4.9-6.696 0-3.864 3.136-7 7-7s7 3.136 7 7c0 3.13-2.05 5.776-4.9 6.696v3.324C16.716 21.59 20 17.178 20 12c0-6.633-5.368-12-11.96-12h4zM8.9 14.8h3.3v3.3H8.9zm-3.3 0h2.5v2.5H5.6zm0-3.3h2.5V14H5.6z" />
      </svg>
    ),
  },
  {
    name: 'Stripe',
    category: 'Fintech & Grants',
    icon: (
      <span className="font-extrabold text-xs tracking-tight text-[#7A73FF] lowercase leading-none">stripe</span>
    ),
  },
];

export default function LandingPage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events?status=all');
        if (res.data.success) {
          setFeaturedEvents(res.data.events.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-primary text-white py-20 lg:py-28 border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Building Solutions. <br />
              <span className="text-secondary">Empowering Innovators.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed font-normal max-w-2xl">
              Welcome to Hackways, the official events and competition platform for innovative minds. Discover curated problem statements, submit cutting-edge prototypes, and collaborate with visionary peers.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="bg-secondary text-primary hover:bg-secondary-hover font-semibold px-7 py-3.5 rounded-xl shadow-card transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2.5 text-base"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 text-accent" />
              </Link>
              <Link
                to="/events"
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 font-medium px-6 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2 text-base"
              >
                <Calendar className="w-5 h-5 text-secondary" />
                Browse Events
              </Link>
            </div>
          </div>

          {/* COMPACT PARTNER LOGO MARQUEE (CONSTRAINED WIDTH & SLEEK HEIGHT) */}
          <div className="mt-10 pt-5 border-t border-white/10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                Our Trusted Partners & Global Sponsors
              </p>
            </div>

            <div className="relative w-full overflow-hidden">
              {/* Left and Right Gradient Fade Vignettes */}
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-10 bg-gradient-to-r from-primary to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 z-10 bg-gradient-to-l from-primary to-transparent pointer-events-none" />

              {/* The Seamless Loop Line */}
              <div className="animate-marquee flex items-center gap-3 py-1">
                {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-secondary/40 shadow-xs backdrop-blur-md transition-all duration-200 flex-shrink-0 cursor-default select-none"
                  >
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center p-1 flex-shrink-0 group-hover:bg-white/15 transition-colors">
                      {partner.icon}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs text-white tracking-wide leading-none group-hover:text-secondary transition-colors whitespace-nowrap">
                        {partner.name}
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-white/45 leading-none mt-1 whitespace-nowrap">
                        {partner.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative background shapes */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 translate-y-1/3"></div>
      </section>

      {/* 2. STATS HIGHLIGHTS BANNER */}
      <section className="bg-background-cream border-b border-accent/15 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">25+</div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent">
                Events Organized
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">4,500+</div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent">
                Active Participants
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">850+</div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent">
                Ideas & Prototypes
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">$50K+</div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent">
                Grants & Prizes Awarded
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="py-20 bg-background" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
                About Hackways
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark tracking-tight">
                Fostering an ecosystem of purposeful engineering & design
              </h2>
              <p className="text-dark-muted text-base leading-relaxed">
                Hackways bridges real-world community challenges with passionate problem solvers. Through our hackathons, ideathons, and innovation incubators, we provide a structured arena for talent to prototype impactful solutions.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-dark">
                    Carefully curated industry and community problem statements.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-dark">
                    Fair, transparent two-stage evaluation with feedback from domain mentors.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-dark">
                    Direct access to incubation, funding grants, and partner opportunities.
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-dark">Idea Proposals</h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Submit architectural proposals, methodology blueprints, and technology frameworks.
                </p>
              </div>

              <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-dark">Working Prototypes</h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Turn ideas into functional demos, repository source code, and live web/mobile apps.
                </p>
              </div>

              <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-dark">Timed Windows</h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Automated problem statement releases and strict server-locked submission deadlines.
                </p>
              </div>

              <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-dark">Prizes & Perks</h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Win verified cash prizes, certificates, cloud credits, and accelerator access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-background-cream/60 border-y border-accent/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-bold text-dark tracking-tight">How The Competition Works</h2>
            <p className="text-dark-muted text-sm">
              A smooth 4-step journey from registration to final evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative">
              <span className="text-3xl font-black text-secondary/70 absolute top-4 right-4">01</span>
              <div className="font-bold text-base text-primary mb-2">Register with OTP</div>
              <p className="text-xs text-dark-muted leading-relaxed">
                Sign up in 30 seconds with email OTP verification. Join solo or with your team.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative">
              <span className="text-3xl font-black text-secondary/70 absolute top-4 right-4">02</span>
              <div className="font-bold text-primary text-base mb-2">Problem Release</div>
              <p className="text-xs text-dark-muted leading-relaxed">
                Problem statements unlock simultaneously for all registered participants on the countdown.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative">
              <span className="text-3xl font-black text-secondary/70 absolute top-4 right-4">03</span>
              <div className="font-bold text-primary text-base mb-2">Submit Proposal</div>
              <p className="text-xs text-dark-muted leading-relaxed">
                Select your problem statement and submit your architecture, approach, and tech stack.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-accent/15 shadow-soft relative">
              <span className="text-3xl font-black text-secondary/70 absolute top-4 right-4">04</span>
              <div className="font-bold text-primary text-base mb-2">Prototype & Demo</div>
              <p className="text-xs text-dark-muted leading-relaxed">
                Upload your prototype, live link, and GitHub code before the submission window closes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED EVENTS SPOTLIGHT */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Explore Opportunities</div>
              <h2 className="text-3xl font-bold text-dark tracking-tight">Active & Upcoming Events</h2>
            </div>
            <Link
              to="/events"
              className="text-primary hover:text-accent font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-80 animate-pulse bg-white/60"></div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="bg-white rounded-2xl border border-accent/15 shadow-card overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                >
                  <div className="h-44 bg-primary/10 relative overflow-hidden">
                    {evt.bannerImage ? (
                      <img
                        src={evt.bannerImage.startsWith('http') ? evt.bannerImage : `${evt.bannerImage}`}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {evt.title}
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        evt.status === 'Ongoing'
                          ? 'bg-emerald-600 text-white'
                          : evt.status === 'Upcoming'
                          ? 'bg-primary text-white'
                          : 'bg-dark-light text-white'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        {evt.category} • {evt.mode}
                      </span>
                      <h3 className="text-lg font-bold text-dark line-clamp-1">{evt.title}</h3>
                      <p className="text-xs text-dark-muted line-clamp-2 leading-relaxed">
                        {evt.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-background-cream flex items-center justify-between">
                      <div className="text-xs text-dark-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        {new Date(evt.startDate).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/events/${evt._id}`}
                        className="text-xs font-semibold text-primary hover:text-accent inline-flex items-center gap-1"
                      >
                        Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card bg-white">
              <p className="text-dark-muted text-sm">No events scheduled at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to show your skills and build real impact?
          </h2>
          <p className="text-white/80 text-base max-w-xl mx-auto">
            Join hundreds of talented developers, architects, and innovators in our next competition.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-8 py-3.5 rounded-xl shadow-card transition-colors inline-flex items-center gap-2 text-base"
            >
              Join the Platform Today
              <ArrowRight className="w-5 h-5 text-accent" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
