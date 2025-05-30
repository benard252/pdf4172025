
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { storageService } from '../services/storageService';
import { useAuth } from './useAuth'; // To associate balance with user

const BALANCE_STORAGE_KEY_PREFIX = 'aamva_user_balance_';

interface BalanceContextType {
  balance: number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean; // Returns true if successful
  isLoading: boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth(); // auth hook can be null initially if AuthProvider is still loading

  const getBalanceStorageKey = useCallback((): string | null => {
    if (auth && auth.user) {
      return `${BALANCE_STORAGE_KEY_PREFIX}${auth.user.id}`;
    }
    return null;
  }, [auth]);

  useEffect(() => {
    if (auth && !auth.isLoading) { // Ensure auth is loaded
      const storageKey = getBalanceStorageKey();
      if (storageKey) {
        const storedBalance = storageService.getItem<number>(storageKey);
        if (storedBalance !== null) {
          setBalance(storedBalance);
        } else {
          // Initialize balance for new or existing user without stored balance
          setBalance(0); 
          storageService.setItem<number>(storageKey, 0);
        }
      } else if (!auth.user) { // User logged out or no user
        setBalance(0); // Reset balance if no user
      }
      setIsLoading(false);
    }
  }, [auth, getBalanceStorageKey]);

  const addFunds = (amount: number) => {
    const storageKey = getBalanceStorageKey();
    if (amount > 0 && storageKey) {
      setBalance(prevBalance => {
        const newBalance = prevBalance + amount;
        storageService.setItem<number>(storageKey, newBalance);
        return newBalance;
      });
    }
  };

  const deductFunds = (amount: number): boolean => {
    const storageKey = getBalanceStorageKey();
    if (amount > 0 && storageKey && balance >= amount) {
      setBalance(prevBalance => {
        const newBalance = prevBalance - amount;
        storageService.setItem<number>(storageKey, newBalance);
        return newBalance;
      });
      return true;
    }
    return false;
  };

  return (
    <BalanceContext.Provider value={{ balance, addFunds, deductFunds, isLoading }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
