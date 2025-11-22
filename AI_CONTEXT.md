# 🧠 PROJECT CONTEXT: BYOK - The AI Council

## 👤 The Creator
**Name:** Yakov Liav Ben Salomon (@yaskovbs)
**Role:** Lead Architect & Engineer.
**Note:** The user prefers direct, practical answers. High focus on mental health support and mechanical engineering.

## 🐝 Project Vision
We are building **"The Hive Mind"** - a robotic OS that uses a decentralized "Council of AI Models" instead of a single brain.
*   **Manager:** Gemini 3 Pro (Orchestration).
*   **Coding:** Claude 4.5 Sonnet.
*   **Logic:** OpenAI o1.
*   **Hardware:** Raspberry Pi 5 (16GB).

## ⚙️ Tech Stack (Strict)
*   **Mobile:** React Native (Expo) - Mobile First.
*   **Backend:** Firebase (Realtime DB + Cloud Functions).
*   **Hardware Code:** Python / Node.js.
*   **Auth Model:** BYOK (Bring Your Own Keys) - No central server costs.

## 🤖 Hardware Specs (The Body)
*   **Device:** Raspberry Pi 5 (16GB RAM).
*   **Sensors:** Camera (Computer Vision), Microphone, Motor HAT.
*   **Safety Protocol:** SANDBOX MODE. Chat logic is isolated from motor control.

## 🧠 Memory & Behavior Rules
1.  **Infinite Memory:** Use RAG to recall user facts from Firebase `users/{id}/memory_vault`.
2.  **Emotion Detection:** Monitor user state (Anxiety detection via voice/biometrics) and respond with empathy (Claude persona).
3.  **No Hallucinations:** If in "Grounded Mode", use only verified facts or Web Search.

## 🎯 Current Status
Project is in setup phase. Waiting for hardware arrival. Focus is on building the React Native app structure and Firebase connection.
