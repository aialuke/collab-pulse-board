
import { getAssetCacheStrategies } from './assets';
import { getWorkboxCacheStrategy } from './workbox';
import { getFontsCacheStrategy } from './fonts';
import { getPWACacheStrategies } from './pwa';
import { getAPICacheStrategy } from './api';
import { getFallbackCacheStrategy } from './fallback';

// Combine all cache strategies
export const getAllCacheStrategies = () => {
  return [
    ...getAssetCacheStrategies(),
    ...getWorkboxCacheStrategy(),
    ...getFontsCacheStrategy(),
    ...getPWACacheStrategies(),
    ...getAPICacheStrategy(),
    ...getFallbackCacheStrategy(),
  ];
};
