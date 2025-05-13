
import { getAPICacheStrategy } from './api';
import { getAssetCacheStrategies } from './assets';
import { getFallbackCacheStrategy } from './fallback';
import { getFontsCacheStrategy } from './fonts';
import { getPWACacheStrategies } from './pwa';
import { getSupabaseCacheStrategy } from './supabase';
import { getWorkboxCacheStrategy } from './workbox';

// Combine all cache strategies
export const getAllCacheStrategies = () => {
  return [
    ...getAPICacheStrategy(),
    ...getAssetCacheStrategies(),
    ...getFallbackCacheStrategy(),
    ...getFontsCacheStrategy(),
    ...getPWACacheStrategies(),
    ...getSupabaseCacheStrategy(),
    ...getWorkboxCacheStrategy(),
  ];
};
