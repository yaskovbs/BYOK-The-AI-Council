# 🚀 OpenRouter Integration - 500+ AI Models

## ✅ מה הושלם?

האפליקציה שלך כעת תומכת ב-**500+ מודלי AI** דרך OpenRouter.ai! 🎉

### מודלים זמינים:
- ✅ **Google Gemini 3 Pro Preview** - הדגל החדש של Google
- ✅ **OpenAI GPT-5.1** - דור חדש של GPT
- ✅ **GPT-5.1 Codex** - מיוחד לתכנות
- ✅ **xAI Grok 4.1 Fast** - 2M context חינם!
- ✅ **Claude 3.5 Sonnet** - מומחה קוד מעולה
- ✅ **Amazon Nova Premier** - מודל חדש של אמזון
- ✅ **Perplexity Sonar Pro** - חיפוש ומחקר מתקדם
- ✅ **Meta Llama 3.1** (כל הגדלים)
- ✅ **Mistral Large** - מודל אירופאי חזק
- ועוד **490+ מודלים נוספים**!

---

## 📱 איך להשתמש?

### 1️⃣ Tab חדש: **Models** 🧠

הוספנו Tab חדש באפליקציה שמראה את כל המודלים הזמינים:

- **חיפוש מודלים** - מצא מודלים לפי שם, יכולות או ספק
- **סינון לפי ספק** - Google, OpenAI, xAI, Anthropic, ועוד
- **פרטים מלאים** - מחיר, context window, יכולות
- **בדיקה ישירה** - בדוק כל מודל עם prompt

### 2️⃣ איך לבחור מודל בצ'אט?

כרגע המערכת משתמשת ב-Council הישן (Gemini, Claude, OpenAI, Grok).

**בעתיד קרוב נוסיף:**
- אפשרות לבחור מודל ספציפי בצ'אט
- בוחר מודלים חכם (Smart Model Selector)
- שימוש במודלים שונים לפי סוג המשימה

---

## 🔑 API Key Configuration

ה-API Key של OpenRouter כבר מוגדר:
```
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
```

**זה מאפשר לך גישה לכל 500+ המודלים דרך API אחד!**

---

## 💰 מחירים

OpenRouter מציע מחירים תחרותיים:

### 🆓 חינם לחלוטין:
- **Grok 4.1 Fast** - 2M context!
- **Gemini 2.5 Flash Lite** - $0.10/$0.40 per M

### 💎 Premium:
- **Gemini 3 Pro Preview** - $2/$12 per M
- **GPT-5.1** - $1.25/$10 per M
- **GPT-5.1 Codex** - $1.25/$10 per M

### ⚡ סופר מהיר וזול:
- **GPT-4o Mini** - $0.15/$0.60 per M
- **Llama 3.1 8B** - $0.055/$0.055 per M

---

## 🎯 מודלים מומלצים לפי משימה

### תכנות (Coding):
1. **GPT-5.1 Codex** - הטוב ביותר
2. **Claude 3.5 Sonnet** - מומחה קוד
3. **DeepSeek Coder V2.5** - זול וטוב

### חשיבה (Reasoning):
1. **Gemini 3 Pro Preview** - 1M context
2. **GPT-5.1** - adaptive reasoning
3. **Gemini 2.5 Pro** - thinking capabilities

### מהיר וזול (Fast & Cheap):
1. **Grok 4.1 Fast** - חינם + 2M context!
2. **Gemini 2.5 Flash Lite** - $0.10/$0.40
3. **GPT-4o Mini** - $0.15/$0.60

### חיפוש ומחקר (Research):
1. **Perplexity Sonar Pro** - הטוב ביותר
2. **Grok 4.1** - real-time data
3. **Gemini 3 Pro** - long context

### תמונות (Images):
1. **Nano Banana Pro** - Gemini 3 based
2. **DALL-E 3** - OpenAI classic

---

## 📊 כיצד עובד OpenRouter?

OpenRouter פועל כ-**"unifier"** - API אחד לכל המודלים:

```typescript
// במקום לנהל 10+ API keys שונים:
const geminiKey = "...";
const openaiKey = "...";
const claudeKey = "...";
// ... ועוד

// עכשיו רק 1 API key:
const openrouterKey = "sk-or-v1-...";

// ושימוש בכל המודלים:
aiService.callOpenRouter(prompt, "google/gemini-3-pro-preview");
aiService.callOpenRouter(prompt, "openai/gpt-5.1");
aiService.callOpenRouter(prompt, "x-ai/grok-4.1-fast");
```

---

## 🛠 קבצים שנוצרו/עודכנו

### חדש:
- ✅ `constants/openrouter-models.ts` - רשימת כל 500+ המודלים
- ✅ `app/(tabs)/models.tsx` - מסך דפדפן מודלים
- ✅ `OPENROUTER_SETUP.md` - הקובץ הזה

### עודכן:
- ✅ `services/aiService.ts` - תמיכה ב-OpenRouter
- ✅ `app/(tabs)/_layout.tsx` - הוספת Tab חדש

---

## 🚀 מה הלאה?

1. **Model Selector בצ'אט** - אפשרות לבחור מודל ספציפי
2. **Smart Routing** - בחירה אוטומטית של המודל הטוב ביותר
3. **Model Comparison** - השוואת מודלים זה מול זה
4. **Cost Tracking** - מעקב אחר עלויות השימוש
5. **Favorites** - שמירת מודלים מועדפים

---

## 💡 טיפים

1. **Grok 4.1 Fast הוא חינם!** - השתמש בו כברירת מחדל
2. **Gemini 2.5 Flash Lite** - מהיר וזול מאוד
3. **GPT-5.1 Codex** - לתכנות רציני
4. **Gemini 3 Pro** - למשימות מורכבות עם context ארוך

---

## 📚 לימוד נוסף

- [OpenRouter Docs](https://openrouter.ai/docs)
- [Model Rankings](https://openrouter.ai/rankings)
- [API Reference](https://openrouter.ai/docs/api-reference)

---

Created by: YAKOV LIAV BEN SALOMON 🇮🇱
Powered by: OpenRouter.ai 🚀
