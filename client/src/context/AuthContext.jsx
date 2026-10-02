import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const SUPER_ADMIN_EMAILS = [
  'discountbuddyshubham@gmail.com',
  'sureshcitabu@gmail.com',
  'tmgmayankff@gmail.com',
];

export const isSuperAdmin = (email) => {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('org_user');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (isSuperAdmin(parsed.email)) {
        parsed.role = 'superadmin';
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState(() => {
    try {
      const cached = localStorage.getItem('org_user');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (isSuperAdmin(parsed.email)) return 'superadmin';
      return parsed.role || 'user';
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const hasToken = !!localStorage.getItem('org_token');
    const hasUser = !!localStorage.getItem('org_user');
    return hasToken && !hasUser;
  });

  // Initialize auth from localStorage / API
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('org_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setRole(res.data.role);
          localStorage.setItem('org_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('org_token');
        localStorage.removeItem('org_user');
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Send OTP for Login or Sign Up
  const sendOTP = async (payload) => {
    const res = await api.post('/auth/send-otp', payload);
    return res.data;
  };

  // Verify OTP and store session
  const verifyOTP = async (payload) => {
    const res = await api.post('/auth/verify-otp', payload);
    if (res.data.success) {
      localStorage.setItem('org_token', res.data.token);
      localStorage.setItem('org_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setRole('user');
    }
    return res.data;
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    const res = await api.post('/auth/google');
    if (res.data.success) {
      const assignedRole = isSuperAdmin(res.data.user?.email) ? 'superadmin' : (res.data.role || 'user');
      const updatedUser = { ...res.data.user, role: assignedRole };
      localStorage.setItem('org_token', res.data.token);
      localStorage.setItem('org_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setRole(assignedRole);
    }
    return res.data;
  };

  // Complete profile after Google sign-in
  const completeProfile = async (payload) => {
    const res = await api.post('/auth/complete-profile', payload);
    if (res.data.success) {
      const assignedRole = isSuperAdmin(res.data.user?.email) ? 'superadmin' : (res.data.user?.role || role || 'user');
      const updatedUser = { ...res.data.user, role: assignedRole };
      setUser(updatedUser);
      localStorage.setItem('org_user', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  // Admin login with email & password
  const adminLogin = async (credentials) => {
    const res = await api.post('/auth/admin-login', credentials);
    if (res.data.success) {
      const assignedRole = isSuperAdmin(res.data.user?.email) ? 'superadmin' : (res.data.user.role || 'admin');
      const updatedUser = { ...res.data.user, role: assignedRole };
      localStorage.setItem('org_token', res.data.token);
      localStorage.setItem('org_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setRole(assignedRole);
    }
    return res.data;
  };

  // Update profile
  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('org_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('org_token');
    localStorage.removeItem('org_user');
    setUser(null);
    setRole(null);
  };

  const isAdmin = role === 'admin' || role === 'superadmin' || isSuperAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        loading,
        sendOTP,
        verifyOTP,
        loginWithGoogle,
        completeProfile,
        adminLogin,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
