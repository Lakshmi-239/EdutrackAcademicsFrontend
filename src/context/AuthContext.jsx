import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          setLoading(false);
          return;
        }

        // Extract roles from token
        let roles = [];
        if (decoded.roles) {
          roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
        } else if (decoded.role) {
          roles = [decoded.role];
        }

        setUser({
          email: decoded.email,
          roles: roles,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('authToken', token);
      const decoded = jwtDecode(token);

      // Extract roles
      let roles = [];
      if (decoded.roles) {
        roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
      } else if (decoded.role) {
        roles = [decoded.role];
      }

      setUser({
        email: decoded.email,
        roles: roles,
      });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const getRoles = () => {
    return user?.roles || [];
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading, // Important for AuthGuard
        isAuthenticated: !!user,
        getRoles,
        hasRole,
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