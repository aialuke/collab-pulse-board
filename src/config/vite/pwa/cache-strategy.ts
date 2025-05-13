
import { getCacheSettings } from './cache-settings';
import { getAllCacheStrategies } from './cache-strategies';

// Cache strategy configuration for Workbox
export const getCacheStrategy = () => {
  return {
    ...getCacheSettings(),
    runtimeCaching: getAllCacheStrategies()
  };
};
