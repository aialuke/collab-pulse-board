
import React, { createContext, useContext, useState } from 'react';

interface RefreshContextType {
  isRefreshing: boolean;
  refreshFeedback: () => Promise<void>;
  setRefreshFunction: (refreshFn: () => Promise<void>) => void;
}

const RefreshContext = createContext<RefreshContextType>({
  isRefreshing: false,
  refreshFeedback: async () => {},
  setRefreshFunction: () => {},
});

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshFunction, setRefreshFunction] = useState<() => Promise<void>>(async () => {});

  const refreshFeedback = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await refreshFunction();
    } catch (error) {
      console.error('Error refreshing feedback:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <RefreshContext.Provider 
      value={{ 
        isRefreshing, 
        refreshFeedback, 
        setRefreshFunction: (fn) => setRefreshFunction(() => fn) 
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};
