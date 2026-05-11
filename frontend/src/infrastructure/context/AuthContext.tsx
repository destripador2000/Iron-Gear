import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../api/authService';
import type { LoginCredentials, RegisterData, User } from '../../domain/auth/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay token al iniciar
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setUser({ id: 0, email: '', name: '', role: '' } as User);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User | null> => {
    setLoading(true);
    setError(null);

    const response = await authService.login(credentials);

    if (response.error) {
      setError(response.error);
      setLoading(false);
      return null;
    }

    if (response.data?.access_token) {
      authService.saveToken(response.data.access_token);
      const userData = response.data.user || { id: 0, email: credentials.email, name: '', role: 'cliente' } as User;
      setUser(userData);
      setLoading(false);
      return userData;
    }

    setLoading(false);
    return null;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const response = await authService.register(data);

    if (response.error) {
      setError(response.error);
      setLoading(false);
      return false;
    }

    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    authService.removeToken();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authService.isAuthenticated(),
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
