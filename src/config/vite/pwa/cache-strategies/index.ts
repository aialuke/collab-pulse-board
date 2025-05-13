
import { getApiCacheStrategy } from './api';
import { getAssetsCacheStrategy } from './assets';
import { getFallbackCacheStrategy } from './fallback';
import { getFontsCacheStrategy } from './fonts';
import { getPWACacheStrategy } from './pwa';
import { getSupabaseCacheStrategy } from './supabase';

// Combine all cache strategies
export const getAllCacheStrategies = () => {
  return [
    ...getApiCacheStrategy(),
    ...getAssetsCacheStrategy(),
    ...getFallbackCacheStrategy(),
    ...getFontsCacheStrategy(),
    ...getPWACacheStrategy(),
    ...getSupabaseCacheStrategy(),
  ];
};
