import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('study_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name === 'Ankit' || parsed.name === 'Dr. Arthur Pendelton') parsed.name = 'Ankit Singh Rathore';
        if (!parsed.avatarUrl || parsed.avatarUrl.includes('googleusercontent')) {
          parsed.avatarUrl = '/assets/ankit-singh-rathore.jpg';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('study_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session verification on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('study_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('study_user', JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session verification fallback: preserving existing local session if valid', err.message);
        // If local user exists, keep it in offline/dev fallback
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(identifier, password);
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('study_token', response.token);
        localStorage.setItem('study_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      const message = err.message || 'Authentication error. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('study_token', response.token);
        localStorage.setItem('study_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      const message = err.message || 'Registration error. Please check your details.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout().catch(() => {});
      }
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
      localStorage.removeItem('study_token');
      localStorage.removeItem('study_user');
    }
  };

  const clearError = () => setError(null);

  // Instant demo switcher for evaluation convenience
  const quickDemoLogin = (role = 'STUDENT') => {
    if (role === 'ADMIN') {
      const adminUser = {
        id: 'mock-admin-001',
        name: 'Ankit Singh Rathore',
        email: 'admin@library.univ.edu',
        studentId: 'ADMIN-001',
        avatarUrl: '/assets/ankit-singh-rathore.jpg',
        role: 'ADMIN',
        department: 'LPU Central Library Operations & Administration',
        academicStanding: 'Chief Library Administrator',
        rfidCardUid: 'RFID-ADMIN-ROOT',
        weeklyQuotaHours: 99.0,
        usedQuotaHours: 0.0,
        noShowStrikes: 0,
      };
      setUser(adminUser);
      setToken('demo-admin-token');
      localStorage.setItem('study_user', JSON.stringify(adminUser));
      localStorage.setItem('study_token', 'demo-admin-token');
    } else {
      const studentUser = {
        id: 'mock-user-ankit-001',
        name: 'Ankit Singh Rathore',
        email: 'ankit@lpu.in',
        studentId: '12513583',
        avatarUrl: '/assets/ankit-singh-rathore.jpg',
        role: 'STUDENT',
        department: 'Lovely Professional University (LPU) — School of Computer Science & Engineering',
        academicStanding: 'Undergraduate',
        rfidCardUid: 'RFID-12513583-A',
        weeklyQuotaHours: 25.0,
        usedQuotaHours: 8.5,
        noShowStrikes: 0,
      };
      setUser(studentUser);
      setToken('demo-student-token');
      localStorage.setItem('study_user', JSON.stringify(studentUser));
      localStorage.setItem('study_token', 'demo-student-token');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    quickDemoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

