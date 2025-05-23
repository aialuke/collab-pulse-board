
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthentication } from '@/hooks/useAuthentication';

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use our custom hook for all authentication logic
  const auth = useAuthentication();
  
  // The value passed to the context is now from our hook
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
