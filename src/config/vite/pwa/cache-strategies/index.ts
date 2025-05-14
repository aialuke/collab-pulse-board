
import { getAssetCacheStrategies } from './assets';
import { getWorkboxCacheStrategy } from './workbox';
import { getFontsCacheStrategy } from './fonts';
import { getPWACacheStrategies } from './pwa';
import { getAdvancedAPICacheStrategy } from './api-advanced';
import { getFallbackCacheStrategy } from './fallback';

// Combine all cache strategies
export const getAllCacheStrategies = () => {
  return [
    ...getAssetCacheStrategies(),
    ...getWorkboxCacheStrategy(),
    ...getFontsCacheStrategy(),
    ...getPWACacheStrategies(),
    ...getAdvancedAPICacheStrategy(),
    ...getFallbackCacheStrategy(),
  ];
};
