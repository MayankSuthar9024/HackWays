import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
      localStorage.setItem('org_token', res.data.token);
      localStorage.setItem('org_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setRole('user');
    }
    return res.data;
  };

  // Complete profile after Google sign-in
  const completeProfile = async (payload) => {
    const res = await api.post('/auth/complete-profile', payload);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('org_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  // Admin login with email & password
  const adminLogin = async (credentials) => {
    const res = await api.post('/auth/admin-login', credentials);
    if (res.data.success) {
      localStorage.setItem('org_token', res.data.token);
      localStorage.setItem('org_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setRole(res.data.user.role);
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

  const isAdmin = role === 'admin' || role === 'superadmin';

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
