
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FeatureFlags {
  enableComments: boolean;
}

interface FeatureFlagContextType {
  features: FeatureFlags;
  toggleFeature: (featureName: keyof FeatureFlags) => void;
}

const defaultFeatures: FeatureFlags = {
  enableComments: false, // Disabled by default as requested
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
