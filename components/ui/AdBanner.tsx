import { View, Text, StyleSheet, Platform } from 'react-native';
import { theme } from '@/constants/theme';

/**
 * AdMob Banner Component
 * 
 * המשתמש צריך להתקין: expo install expo-ads-admob או react-native-google-mobile-ads
 * 
 * לעכשיו זה placeholder - כדי להפעיל AdMob אמיתי:
 * 
 * 1. התקן את החבילה:
 *    npx expo install react-native-google-mobile-ads
 * 
 * 2. הגדר את ה-App IDs ב-app.json (כבר מוגדר):
 *    - Android: ca-app-pub-9953179201685717~6124468956
 *    - iOS: ca-app-pub-9953179201685717~6423141418
 * 
 * 3. החלף את הקוד הזה ב:
 * 
 *    import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
 * 
 *    const adUnitId = __DEV__ 
 *      ? TestIds.BANNER
 *      : Platform.select({
 *          ios: 'ca-app-pub-9953179201685717/1063713964',
 *          android: 'ca-app-pub-9953179201685717/5655471769',
 *        });
 * 
 *    return (
 *      <View style={styles.container}>
 *        <BannerAd
 *          unitId={adUnitId!}
 *          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
 *          requestOptions={{
 *            requestNonPersonalizedAdsOnly: true,
 *          }}
 *        />
 *      </View>
 *    );
 */

export function AdBanner() {
  const adInfo = Platform.select({
    ios: {
      appId: 'ca-app-pub-9953179201685717~6423141418',
      bannerId: 'ca-app-pub-9953179201685717/1063713964',
    },
    android: {
      appId: 'ca-app-pub-9953179201685717~6124468956',
      bannerId: 'ca-app-pub-9953179201685717/5655471769',
    },
    default: {
      appId: 'Not Available on Web',
      bannerId: 'Not Available on Web',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>📢 AdMob Banner Placeholder</Text>
        <Text style={styles.placeholderText}>
          To activate real ads, install: react-native-google-mobile-ads
        </Text>
        <View style={styles.idsContainer}>
          <Text style={styles.idText}>App ID: {adInfo?.appId}</Text>
          <Text style={styles.idText}>Banner ID: {adInfo?.bannerId}</Text>
        </View>
      </View>
      <Text style={styles.adLabel}>Ad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  placeholder: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  idsContainer: {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  idText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  adLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
