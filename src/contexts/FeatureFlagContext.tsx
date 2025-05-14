
import React, { createContext, useContext, ReactNode } from 'react';

interface FeatureFlagContextType {
  features: {};
}

const FeatureFlagContext = createContext<FeatureFlagContextType>({ features: {} });

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  // Minimal implementation that just renders children
  return (
    <FeatureFlagContext.Provider value={{ features: {} }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
