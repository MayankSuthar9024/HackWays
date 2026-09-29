import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const { user, isAdmin, adminLogin } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.success) {
        success('Administrator authentication successful.');
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-secondary shadow-card mb-1">
            <Shield className="w-7 h-7 text-secondary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark">
            Admin Command Center
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted">
            Restricted access for event coordinators and administrators
          </p>
        </div>

        {/* Card */}
        <div className="card bg-white shadow-card border border-accent/20 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@organization.org"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 font-semibold text-sm rounded-xl shadow-md"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Authenticate as Admin</span>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-accent/15 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-dark-muted hover:text-dark inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Participant Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
