# 💰 AdMob Integration Guide - מדריך הטמעת AdMob

## ✅ מה כבר מוכן?

כל המזהים של AdMob כבר מוגדרים ב-`app.json`:

### Android:
- **App ID:** `ca-app-pub-9953179201685717~6124468956`
- **Banner Unit ID:** `ca-app-pub-9953179201685717/5655471769`

### iOS:
- **App ID:** `ca-app-pub-9953179201685717~6423141418`
- **Banner Unit ID:** `ca-app-pub-9953179201685717/1063713964`

---

## 🚀 שלבי הטמעה (3 דקות)

### שלב 1: התקן את החבילה הנדרשת

```bash
npx expo install react-native-google-mobile-ads
```

### שלב 2: הוסף את הפלאגין ל-app.json

פתח את `app.json` והוסף ל-`plugins`:

```json
"plugins": [
  "expo-router",
  "expo-splash-screen",
  "expo-web-browser",
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-9953179201685717~6124468956",
      "iosAppId": "ca-app-pub-9953179201685717~6423141418"
    }
  ]
]
```

### שלב 3: עדכן את AdBanner Component

פתח את `components/ui/AdBanner.tsx` והחלף את כל הקוד ב:

```typescript
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { theme } from '@/constants/theme';

export function AdBanner() {
  const adUnitId = __DEV__ 
    ? TestIds.BANNER  // מצב פיתוח - מודעות בדיקה
    : Platform.select({
        ios: 'ca-app-pub-9953179201685717/1063713964',
        android: 'ca-app-pub-9953179201685717/5655471769',
      }) || TestIds.BANNER;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
```

### שלב 4: בנה מחדש

```bash
npx expo prebuild --clean
npx expo run:android  # או run:ios
```

---

## 🎯 מה המודעות יופיעו?

המודעות כבר מוטמעות בדף הצ'אט (`app/(tabs)/chat.tsx`) בתחתית המסך.

---

## 🧪 בדיקה

### מצב פיתוח (__DEV__):
- המערכת משתמשת אוטומטית ב-**Test Ads** של Google
- זה מונע חסימת חשבון AdMob

### מצב ייצור (Production):
- כשתבנה APK/IPA אמיתי, המודעות יהיו **אמיתיות**
- רווחים יתחילו להצטבר 💰

---

## ⚠️ חשוב לדעת!

1. **אל תלחץ על המודעות שלך בפיתוח** - זה יכול לחסום את החשבון
2. **המודעות לא יופיעו ב-Expo Go** - צריך native build
3. **צריך לפחות 1000 חשיפות ליום** כדי לראות רווחים משמעותיים
4. **Google צריך לאשר את האפליקציה** - זה יכול לקחת 24-48 שעות

---

## 💡 טיפים למקסום רווחים

1. **מיקום אופטימלי:** בתחתית המסך (כבר מוטמע כך)
2. **תדירות:** מודעה אחת לדף (לא להציף)
3. **גודל:** `ANCHORED_ADAPTIVE_BANNER` - גודל דינמי שמתאים לכל מסך
4. **תוכן איכותי:** יותר משתמשים = יותר כסף

---

## 📊 מעקב אחר רווחים

1. היכנס ל: https://apps.admob.google.com
2. לך ל: **Reports** → **Overview**
3. תראה:
   - **Impressions** - כמה פעמים המודעה הוצגה
   - **Clicks** - כמה פעמים לחצו עליה
   - **Revenue** - כמה הרווחת 💵

---

## 🐛 פתרון בעיות נפוצות

### "Ad failed to load"
- ודא שיש אינטרנט
- בדוק שהמזהים נכונים ב-app.json
- המתן 24 שעות - Google צריך לאשר את החשבון

### "Invalid Ad Unit ID"
- ודא ש-prebuild רץ אחרי הוספת הפלאגין
- בדוק שה-App IDs ב-app.json זהים ל-google-services.json

### המודעות לא מופיעות ב-Web
- זה נורמלי - AdMob לא עובד ב-Web
- המודעות יופיעו רק ב-Android/iOS

---

## 🎓 למידע נוסף

- [Google AdMob Documentation](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://docs.page/invertase/react-native-google-mobile-ads)

---

Created by: YAKOV LIAV BEN SALOMON 🇮🇱
