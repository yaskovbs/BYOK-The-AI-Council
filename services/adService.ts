import { Platform } from 'react-native';
import { ADMOB_CONFIG } from '@/constants/config';

// AdMob Configuration
// Note: Full AdMob integration requires installing react-native-google-mobile-ads
// For now, this provides the configuration structure

export const initializeAds = async () => {
  try {
    console.log('AdMob configuration ready');
    console.log('Android App ID:', ADMOB_CONFIG.android.appId);
    console.log('iOS App ID:', ADMOB_CONFIG.ios.appId);
  } catch (error) {
    console.log('AdMob initialization error:', error);
  }
};

// Get Banner Ad Unit ID
export const getBannerAdUnitId = (): string => {
  return Platform.select({
    ios: ADMOB_CONFIG.ios.bannerId,
    android: ADMOB_CONFIG.android.bannerId,
  }) || '';
};

// Get Interstitial Ad Unit ID
export const getInterstitialAdUnitId = (): string => {
  return Platform.select({
    ios: ADMOB_CONFIG.ios.bannerId,
    android: ADMOB_CONFIG.android.bannerId,
  }) || '';
};

export const BannerAdSize = {
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
};
