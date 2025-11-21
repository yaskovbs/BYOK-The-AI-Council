import { Platform } from 'react-native';
import { ADMOB_CONFIG } from '@/constants/config';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

// Initialize AdMob
export const initializeAds = async () => {
  try {
    await mobileAds().initialize();
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.log('AdMob initialization error:', error);
  }
};

// Get Banner Ad Unit ID
export const getBannerAdUnitId = (): string => {
  if (__DEV__) {
    return TestIds.BANNER;
  }
  
  return Platform.select({
    ios: ADMOB_CONFIG.ios.bannerId,
    android: ADMOB_CONFIG.android.bannerId,
  }) || TestIds.BANNER;
};

// Get Interstitial Ad Unit ID
export const getInterstitialAdUnitId = (): string => {
  if (__DEV__) {
    return TestIds.INTERSTITIAL;
  }
  
  return Platform.select({
    ios: ADMOB_CONFIG.ios.bannerId,
    android: ADMOB_CONFIG.android.bannerId,
  }) || TestIds.INTERSTITIAL;
};

// Create and load Interstitial Ad
export const createInterstitialAd = () => {
  const interstitial = InterstitialAd.createForAdRequest(getInterstitialAdUnitId(), {
    requestNonPersonalizedAdsOnly: false,
  });

  return interstitial;
};

// Show Interstitial Ad with error handling
export const showInterstitialAd = async (interstitial: InterstitialAd): Promise<boolean> => {
  try {
    if (interstitial.loaded) {
      await interstitial.show();
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error showing interstitial ad:', error);
    return false;
  }
};

export { BannerAdSize };
