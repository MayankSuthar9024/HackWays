import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Phone,
  School,
  Mail,
  Calendar,
  GraduationCap,
  BadgeCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  X,
} from 'lucide-react';

export default function UserDetailsModal({ isOpen, onClose, onSaved }) {
  const { user, completeProfile } = useAuth();
  const { success, error: showError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institute, setInstitute] = useState('');
  const [year, setYear] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setInstitute(user.institute || user.college || '');
      setYear(user.year || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      showError('Please enter a valid email address.');
      return;
    }
    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      showError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!institute.trim()) {
      showError('Please enter your college or institute name.');
      return;
    }
    if (!year) {
      showError('Please select your year of study.');
      return;
    }

    setSaving(true);
    try {
      const res = await completeProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: institute.trim(),
        institute: institute.trim(),
        year: year.trim(),
      });

      if (res.success) {
        success('Profile details saved! Welcome to Hackways.');
        if (onSaved) {
          onSaved(res.user || user);
        } else if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      console.error('Save Profile Error:', err);
      showError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-accent/20 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-secondary" />

        {/* Header with Close */}
        <div className="p-6 pb-4 sm:p-7 sm:pb-4 border-b border-accent/15 relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-dark-muted hover:text-dark hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3.5 mb-2">
            {photoURL ? (
              <img
                src={photoURL}
                alt={name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
                Enter Your Details
              </h2>
            </div>
          </div>
          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            Please complete your contact and academic information to finalize registration.
          </p>
        </div>

        {/* Popup Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 uppercase tracking-wide">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-dark uppercase tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200/50">
                <CheckCircle2 className="w-3 h-3" /> Google Verified
              </span>
            </div>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 uppercase tracking-wide">
              Phone Number (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
              />
            </div>
            <span className="text-[10px] text-dark-muted mt-1 block">Used for event WhatsApp group updates and check-in</span>
          </div>

          {/* Institute / College Name */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 uppercase tracking-wide">
              Institute / College Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <School className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 uppercase tracking-wide">
              Year of Study <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
              <select
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-background-cream text-dark border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-3.5 pointer-events-none text-dark-muted text-xs">▼</div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Details...</span>
                </>
              ) : (
                <>
                  <span>Save &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {onClose && (
            <div className="text-center pt-1 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-dark-muted hover:text-dark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
