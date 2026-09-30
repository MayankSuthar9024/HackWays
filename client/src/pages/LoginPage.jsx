import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Mail, User, Phone, School, ArrowRight, Shield, KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { user, sendOTP, verifyOTP, loginWithGoogle } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [step, setStep] = useState(1); // 1: Details form, 2: OTP Verification
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [otp, setOtp] = useState('');

  // Timer for OTP countdown
  const [timer, setTimer] = useState(300); // 5 mins in seconds
  const [canResend, setCanResend] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/events';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Countdown clock effect for Step 2
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        success('Welcome! Signed in with Google successfully.');
        const from = location.state?.from?.pathname || '/events';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      showError(err.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        showError('Please enter your full name.');
        return;
      }
      if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
        showError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        purpose: mode,
        ...(mode === 'signup' && {
          name: name.trim(),
          phone: phone.trim(),
          college: college.trim(),
        }),
      };

      const res = await sendOTP(payload);
      if (res.success) {
        success(res.message || `Verification code sent to ${email}`);
        setStep(2);
        setTimer(300);
        setCanResend(false);
      }
    } catch (err) {
      console.error('Send OTP Error:', err);
      const serverMessage = err.response?.data?.message;

      if (serverMessage && serverMessage.includes('already exists')) {
        showError(serverMessage);
        // Automatically switch to Passwordless Login tab for convenience
        setMode('login');
      } else if (serverMessage && serverMessage.includes('No registered user found')) {
        showError(serverMessage);
        // Automatically switch to New Registration tab
        setMode('signup');
      } else if (err.response?.status === 500) {
        showError(serverMessage || 'Server or database error. Please ensure the database is connected.');
      } else if (err.message === 'Network Error' || !err.response) {
        showError('Unable to connect to the backend server. Please check your internet or server deployment status.');
      } else {
        showError(serverMessage || err.message || 'Failed to send verification code. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      showError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (res.success) {
        success('Welcome! You have successfully logged in.');
        const from = location.state?.from?.pathname || '/events';
        navigate(from, { replace: true });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        purpose: mode,
        ...(mode === 'signup' && { name, phone, college }),
      };
      const res = await sendOTP(payload);
      if (res.success) {
        info('New verification code sent to your email.');
        setTimer(300);
        setCanResend(false);
        setOtp('');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-secondary shadow-card mb-2">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark">
            {step === 1 ? (mode === 'login' ? 'Welcome Back' : 'Create Participant Account') : 'Verify Email Address'}
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted">
            {step === 1
              ? mode === 'login'
                ? 'Sign in passwordlessly with a one-time email code'
                : 'Join our innovation community in seconds'
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-white shadow-card border border-accent/20 rounded-2xl p-6 sm:p-8">
          {step === 1 ? (
            <div>
              {/* Google One-Click Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-accent/25 bg-white hover:bg-neutral-50 text-dark font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 mb-6 group cursor-pointer"
              >
                {googleLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
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

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-accent/20 w-full"></div>
                <span className="bg-white px-3 text-xs uppercase font-semibold text-dark-muted tracking-wider absolute">
                  Or continue with email
                </span>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-background-cream p-1 rounded-xl mb-6 border border-accent/15">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-dark-muted hover:text-dark'
                  }`}
                >
                  Passwordless Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-dark-muted hover:text-dark'
                  }`}
                >
                  New Registration
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendOTP} className="space-y-4">
                {mode === 'signup' && (
                  <>
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
                          placeholder="e.g. Sarah Connor"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                        10-Digit Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Phone className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 9876543210"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                        College / University / Organization
                      </label>
                      <div className="relative flex items-center">
                        <School className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. Institute of Technology"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 font-semibold text-sm rounded-xl mt-6 shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4 text-secondary" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: OTP Verification Screen */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-secondary/60 text-primary mb-1">
                  <KeyRound className="w-6 h-6 text-accent" />
                </div>
                <div className="text-xs text-dark-muted font-medium">
                  Enter the 6-digit code sent to:
                  <div className="font-bold text-dark text-sm mt-0.5">{email}</div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[12px] text-2xl font-bold py-3 bg-white border-2 border-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-dark-muted">
                <div className="flex items-center gap-1.5">
                  <span>Code expires in:</span>
                  <span className="font-bold text-primary">{formatTimer(timer)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || loading}
                  className={`font-semibold inline-flex items-center gap-1 ${
                    canResend
                      ? 'text-primary hover:text-accent cursor-pointer'
                      : 'text-dark-muted/50 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full btn-primary py-3 font-semibold text-sm rounded-xl shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                  }}
                  className="w-full text-xs font-semibold text-dark-muted hover:text-dark py-2 inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change email or details
                </button>
              </div>
            </form>
          )}

          {/* Admin Portal Gateway */}
          <div className="mt-8 pt-6 border-t border-accent/15 text-center">
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-accent hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Are you an Organizer or Administrator? Log in here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
