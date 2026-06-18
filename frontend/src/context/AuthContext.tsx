
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('rustik_user');
    const storedToken = localStorage.getItem('rustik_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.requireOTP) {
        return data;
      }

      localStorage.setItem('rustik_user', JSON.stringify(data.user));
      localStorage.setItem('rustik_token', data.token);

      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }

      localStorage.setItem('rustik_user', JSON.stringify(data.user));
      localStorage.setItem('rustik_token', data.token);

      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('rustik_user');
    localStorage.removeItem('rustik_token');
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updatedData) => {
    if (!token || !user) return;
    try {
      const response = await fetch(`${API_URL}/auth/employees/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      if (data.success) {
        // If updating self
        const newUser = { ...user, ...data.employee };
        localStorage.setItem('rustik_user', JSON.stringify(newUser));
        setUser(newUser);
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const isAdmin = user && (user.role === 'owner' || user.role === 'manager' || user.role === 'admin');
  const isBarber = user && user.role === 'barber';
  const isAdminRole = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isBarber, isAdminRole, updateProfile, verifyOTP }}>
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
