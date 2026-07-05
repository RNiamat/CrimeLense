import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('cl_token');
        const cached = await SecureStore.getItemAsync('cl_user');

        if (token && cached) {
          try {
            const parsed = JSON.parse(cached);
            setUser(parsed);
            setIsAuthenticated(true);
          } catch (_) {}

          try {
            const { user: freshUser } = await authService.me();
            setUser(freshUser);
            setIsAuthenticated(true);
            await SecureStore.setItemAsync('cl_user', JSON.stringify(freshUser));
          } catch (error) {
            await SecureStore.deleteItemAsync('cl_token');
            await SecureStore.deleteItemAsync('cl_user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Session restore error", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: userData } = await authService.login(email, password);
    await SecureStore.setItemAsync('cl_token', token);
    await SecureStore.setItemAsync('cl_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { token, user: userData } = await authService.register(name, email, password);
    await SecureStore.setItemAsync('cl_token', token);
    await SecureStore.setItemAsync('cl_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('cl_token');
    await SecureStore.deleteItemAsync('cl_user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback(async (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      SecureStore.setItemAsync('cl_user', JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
