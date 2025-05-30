
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

const USER_STORAGE_KEY = 'aamva_user';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = storageService.getItem<User>(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    storageService.setItem<User>(USER_STORAGE_KEY, userData);
  };

  const logout = () => {
    setUser(null);
    storageService.removeItem(USER_STORAGE_KEY);
    // Also clear balance on logout if desired, or manage separately
    // storageService.removeItem(BALANCE_STORAGE_KEY); // If you have a BALANCE_STORAGE_KEY
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
