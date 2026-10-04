import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('collegeconnect_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    is_initialized: true,
    institution_name: 'CollegeConnect Institute of Technology',
    institution_domain: 'college.edu',
    dev_capture_enabled: true,
  });
  const { error: toastError, success: toastSuccess } = useToast();

  const fetchSystemStatus = useCallback(async () => {
    try {
      const res = await api.get('/auth/status');
      if (res.data) {
        setSystemStatus(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch system status:', err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('collegeconnect_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.warn('Session check failed or expired:', err.message);
      // Clear token on auth failure
      localStorage.removeItem('collegeconnect_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemStatus();
    refreshUser();
  }, [fetchSystemStatus, refreshUser]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const authToken = res.data?.token;
      const authUser = res.data?.user;

      if (authToken) {
        localStorage.setItem('collegeconnect_token', authToken);
        setToken(authToken);
        setUser(authUser);
        toastSuccess(`Welcome back, ${authUser.full_name}!`);
        return { success: true, role: authUser.primary_role };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      if (err.code === 'PENDING_VERIFICATION') {
        toastError(err.message || 'Account pending email verification.');
        return { success: false, code: 'PENDING_VERIFICATION', email };
      }
      toastError(err.message || 'Login failed. Please check your credentials.');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('collegeconnect_token');
      setToken(null);
      setUser(null);
      toastSuccess('You have been logged out securely.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.primary_role || null,
        departmentId: user?.department_id || null,
        departmentName: user?.department_name || null,
        isLoading,
        systemStatus,
        login,
        logout,
        refreshUser,
        fetchSystemStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
