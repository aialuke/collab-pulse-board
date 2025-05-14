
// This file is kept as a minimal placeholder to avoid breaking imports
// The feature flag functionality has been removed as it was adding overhead without benefits

import React, { createContext, useContext, ReactNode } from 'react';

// Empty interface as we're removing all feature flags
interface FeatureFlags {}

interface FeatureFlagContextType {
  features: FeatureFlags;
  toggleFeature: (featureName: string) => void;
}

const defaultFeatures: FeatureFlags = {};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}

interface FeatureFlagProviderProps {
  children: ReactNode;
  initialFeatures?: Partial<FeatureFlags>;
}

export function FeatureFlagProvider({ 
  children,
  initialFeatures = {} 
}: FeatureFlagProviderProps) {
  // Simplified implementation that does nothing but satisfies the interface
  const features = {} as FeatureFlags;
  
  const toggleFeature = () => {
    // No-op function as we've removed feature flags
    console.log('Feature flags have been removed from the application');
  };

  return (
    <FeatureFlagContext.Provider value={{ features, toggleFeature }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
