import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Centralized API configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://lostandfound-1vzs.onrender.com/api';

console.log('🔗 AuthContext API URL:', API_URL);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user from token
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = useCallback(async (data) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.token) {
      localStorage.setItem('token', result.token);
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  }, []);

  const login = useCallback(async (data) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.token) {
      localStorage.setItem('token', result.token);
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
