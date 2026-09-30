import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  User,
  Phone,
  School,
  ArrowRight,
  Shield,
  RefreshCw,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const { user, loginWithGoogle, completeProfile } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 'signin' | 'complete_profile'
  const [step, setStep] = useState('signin');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Form fields for profile completion
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Check login state on mount
  useEffect(() => {
    if (user) {
      if (user.phone && user.college) {
        const from = location.state?.from?.pathname || '/events';
        navigate(from, { replace: true });
      } else {
        // User logged in via Google but profile incomplete
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setCollege(user.college || '');
        setPhotoURL(user.photoURL || '');
        setStep('complete_profile');
      }
    }
  }, [user, navigate, location]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        const loggedUser = res.user;
        if (res.isProfileComplete || (loggedUser?.phone && loggedUser?.college)) {
          success(`Welcome back, ${loggedUser.name}!`);
          const from = location.state?.from?.pathname || '/events';
          navigate(from, { replace: true });
        } else {
          setName(loggedUser.name || '');
          setEmail(loggedUser.email || '');
          setPhone(loggedUser.phone || '');
          setCollege(loggedUser.college || '');
          setPhotoURL(loggedUser.photoURL || '');
          setStep('complete_profile');
          info('Please complete your profile to continue.');
        }
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      showError(err.message || 'Google Sign-In failed or was cancelled.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Please enter your full name.');
      return;
    }
    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      showError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!college.trim()) {
      showError('Please enter your college or organization name.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await completeProfile({
        name: name.trim(),
        phone: phone.trim(),
        college: college.trim(),
      });

      if (res.success) {
        success('Profile saved to Firebase successfully! Welcome to Hackways.');
        const from = location.state?.from?.pathname || '/events';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Save Profile Error:', err);
      showError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-secondary shadow-card mb-2">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-dark">
            {step === 'signin' ? 'Sign in to Hackways' : 'Complete Your Profile'}
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            {step === 'signin'
              ? 'One-click direct Google sign-in to explore and register for hackathons'
              : 'Save your participant information to register for hackathons & events'}
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-white shadow-card border border-accent/20 rounded-2xl p-6 sm:p-8">
          {step === 'signin' ? (
            <div className="space-y-6">
              {/* Direct Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3.5 py-3.5 px-5 rounded-xl border border-accent/30 bg-white hover:bg-neutral-50 text-dark font-bold text-sm sm:text-base transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
              >
                {googleLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Benefits checklist */}
              <div className="rounded-xl bg-background-cream/60 p-4 border border-accent/15 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-dark font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Instant access with your Google account</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-dark font-medium">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Real-time event synchronization powered by Firebase</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-dark font-medium">
                  <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>No passwords or OTP verification required</span>
                </div>
              </div>

              {/* Admin Portal Link */}
              <div className="pt-2 border-t border-accent/15 text-center">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Event Organizer / Admin Sign In &rarr;</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Step 2: Complete Profile Data */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* User preview header */}
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                {photoURL ? (
                  <img src={photoURL} alt={name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-dark truncate">{name || 'Google User'}</div>
                  <div className="text-[11px] text-dark-muted truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-600" />
                    <span>{email}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                  />
                </div>
                <span className="text-[10px] text-dark-muted mt-1 block">Used for team coordination and hackathon updates</span>
              </div>

              {/* College / Organization */}
              <div>
                <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                  College / Organization <span className="text-red-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <School className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. MIT, Stanford, IIT Delhi, or Company"
                    className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all mt-2 disabled:opacity-60 cursor-pointer"
              >
                {savingProfile ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Continue to Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
