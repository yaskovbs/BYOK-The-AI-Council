# 🔐 Google OAuth Setup Instructions

## הבעיה: שגיאת 403 "You do not have access"

השגיאה מתרחשת כי Google OAuth דורש הגדרות נוספות ב-Firebase Console וב-Google Cloud Console.

---

## ✅ פתרון מהיר (Recommended)

### שלב 1: Firebase Console
1. היכנס ל: https://console.firebase.google.com
2. בחר את הפרויקט: **the-hive-mind-robot**
3. לך ל: **Authentication** → **Sign-in method** → **Google**
4. ודא שהסטטוס: **Enabled** ✅

### שלב 2: Google Cloud Console - הוספת Authorized redirect URIs
1. היכנס ל: https://console.cloud.google.com
2. בחר פרויקט: **the-hive-mind-robot**
3. לך ל: **APIs & Services** → **Credentials**
4. בחר את ה-OAuth 2.0 Client ID: `1059955046558-0s3mfdp6g427in9929jk7lanhltrsfd6`

5. **הוסף את כל ה-URIs האלה ל-Authorized redirect URIs:**

```
https://the-hive-mind-robot.firebaseapp.com/__/auth/handler
https://pvihacmrknkoiliwrlfc.supabase.co/auth/v1/callback
http://localhost:19006/__/auth/handler
http://localhost:8081/__/auth/handler
exp://localhost:8081
theaicouncil://
```

6. **הוסף את כל ה-URIs האלה ל-Authorized JavaScript origins:**

```
https://the-hive-mind-robot.firebaseapp.com
https://pvihacmrknkoiliwrlfc.supabase.co
http://localhost:19006
http://localhost:8081
```

7. לחץ **Save** 💾

### שלב 3: בדיקה
1. חכה 5-10 דקות (Google צריך זמן לעדכן)
2. נסה להתחבר שוב עם Google

---

## 🔧 פתרון חלופי: שימוש ב-Supabase Auth במקום Firebase

אם Google OAuth ממשיך לא לעבוד, אפשר להשתמש ב-Supabase שכבר מוכן בפרויקט:

### מה כבר עובד:
- ✅ Email/Password Authentication
- ✅ OTP (Email Code) Authentication
- ✅ Supabase מוכן ומחובר

### Google OAuth דרך Supabase (אופציונלי):
1. היכנס ל-Supabase Dashboard: https://supabase.com/dashboard
2. בחר פרויקט: **pvihacmrknkoiliwrlfc**
3. לך ל: **Authentication** → **Providers** → **Google**
4. הוסף את ה-Client ID ו-Client Secret שלך
5. שמור והמערכת תעבוד אוטומטית

---

## 🚀 האם זה עובד עכשיו?

אחרי שתעשה את השלבים למעלה, נסה:

1. **נקה את ה-cache:**
   ```bash
   npx expo start -c
   ```

2. **התחבר שוב עם Google** 🎉

---

## 💡 טיפים
- Google OAuth עובד טוב יותר על **מכשיר אמיתי** מאשר בסימולטור
- אם יש שגיאה, בדוק את ה-**redirect URIs** שוב ב-Google Cloud Console
- זה יכול לקחת עד 10 דקות עד ש-Google מעדכן את ההגדרות

---

## 📱 הורדת APK לטסטים
אם אתה רוצה לבדוק על Android אמיתי:
1. לחץ על כפתור **Download** (למעלה)
2. בחר **Android APK**
3. התקן במכשיר
4. נסה Google Login במכשיר פיזי 📱

---

Created by: YAKOV LIAV BEN SALOMON 🇮🇱
