// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, logout as authLogout, getUser } from '../utils/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      if (isAuthenticated()) {
        const userData = getUser();
        if (userData && userData.role === 'admin') {
          setUser(userData);
        } else {
          logout(); // Clear non-admin user data
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    if (userData.role === 'admin') {
      setUser(userData);
    } else {
      throw new Error('Only admin users can access this panel');
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user && user.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};