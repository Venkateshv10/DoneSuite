import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication - in real app, this would be an API call
        if (email === 'admin@example.com' && password === 'password') {
          const userData = {
            id: 1,
            email: email,
            name: 'Admin User',
            role: 'admin',
            avatar: null,
            provider: 'email'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else if (email.includes('@') && password.length >= 6) {
          const userData = {
            id: 2,
            email: email,
            name: email.split('@')[0],
            role: 'user',
            avatar: null,
            provider: 'email'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const loginWithOAuth = async (provider) => {
    // Simulate OAuth authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Mock OAuth user data
          const mockOAuthUsers = {
            google: {
              id: 3,
              email: 'user@gmail.com',
              name: 'Google User',
              role: 'user',
              avatar: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G',
              provider: 'google'
            },
            github: {
              id: 4,
              email: 'user@github.com',
              name: 'GitHub User',
              role: 'user',
              avatar: 'https://via.placeholder.com/150/333333/FFFFFF?text=GH',
              provider: 'github'
            },
            microsoft: {
              id: 5,
              email: 'user@microsoft.com',
              name: 'Microsoft User',
              role: 'user',
              avatar: 'https://via.placeholder.com/150/00A4EF/FFFFFF?text=MS',
              provider: 'microsoft'
            }
          };

          const userData = mockOAuthUsers[provider];
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            resolve(userData);
          } else {
            reject(new Error(`Authentication with ${provider} failed`));
          }
        } catch (error) {
          reject(new Error(`Authentication with ${provider} failed`));
        }
      }, 1500);
    });
  };

  const register = async (name, email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@') && password.length >= 6 && name.length >= 2) {
          const userData = {
            id: Date.now(),
            email: email,
            name: name,
            role: 'user',
            avatar: null,
            provider: 'email'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Please provide valid information'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedUser = { ...user, ...updates };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          resolve(updatedUser);
        } catch (error) {
          reject(new Error('Failed to update profile'));
        }
      }, 500);
    });
  };

  const value = {
    user,
    login,
    loginWithOAuth,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};