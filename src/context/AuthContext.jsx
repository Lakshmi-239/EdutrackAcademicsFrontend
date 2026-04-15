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

  // Helper to safely validate and decode token
  const extractUserData = (token) => {
    try {
      // 1. Check if token exists and has the correct 3-part JWT structure
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        return null;
      }
      
      const decoded = jwtDecode(token);
      
      // 2. Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        return null;
      }

      // 3. Extract roles (Handling .NET default URI claim names)
      const dotNetRoleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const rawRoles = decoded[dotNetRoleClaim] || decoded.role || decoded.roles || [];
      
      // 4. Normalize roles to an array
      const rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

      return {
        email: decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        roles: rolesArray,
        id: decoded.id
      };
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const userData = extractUserData(token);
      if (userData) {
        setUser(userData);
      } else {
        logout(); // Cleanup invalid/expired token
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    if (!token) return;

    // Clean "Bearer " prefix if the API sent it
    const cleanToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    
    const userData = extractUserData(cleanToken);
    if (userData) {
      localStorage.setItem('authToken', cleanToken);
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        getRoles: () => user?.roles || [],
        hasRole: (role) => user?.roles?.includes(role) || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};