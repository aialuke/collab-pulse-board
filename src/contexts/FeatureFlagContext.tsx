
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FeatureFlags {
  // Comment functionality has been removed
}

interface FeatureFlagContextType {
  features: FeatureFlags;
  toggleFeature: (featureName: keyof FeatureFlags) => void;
}

const defaultFeatures: FeatureFlags = {
  // Empty object as comments functionality has been removed
};

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
  const [features, setFeatures] = useState<FeatureFlags>({
    ...defaultFeatures,
    ...initialFeatures
  });

  const toggleFeature = (featureName: keyof FeatureFlags) => {
    setFeatures(prev => ({
      ...prev,
      [featureName]: !prev[featureName]
    }));
  };

  return (
    <FeatureFlagContext.Provider value={{ features, toggleFeature }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
