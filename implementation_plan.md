# WellNest Personal Wellness Mobile Application

## Goal Description

Build a **React Native with Expo** mobile application (**iOS & Android**) that offers AI‑powered tracking of emotional, physical, and lifestyle wellbeing, delivers **full‑program generation** recommendations via **OpenAI ChatGPT**, stores user data in **Supabase**, authenticates with **email/password**, and provides a **real‑time chat** community featuring **regional groups for African practices**. The UI will support **both dark and light modes** with **glass‑morphism** styling.

---

## User Review Confirmed

- **Platform**: Mobile (iOS & Android) using React Native with Expo.
- **AI Provider**: OpenAI (ChatGPT).
- **Data Storage**: Supabase (PostgreSQL + Realtime).
- **Authentication**: Email/Password.
- **Design Style**: Dark & Light mode with glass‑morphism.
- **Community**: Real‑time chat with regional groups.
- **AI Personalization**: Full‑program generation (daily, weekly, and multi‑week plans).
- **Regulatory**: Must comply with GDPR and related privacy regulations.
- **Backend**: New scaffolded Node/Express backend.

---

## Proposed Changes

### 1. Project Scaffold
- Run `npx create-expo-app@latest WellNestMobile --template expo-template-blank-typescript`.
- Remove default template files, keep only `App.tsx` and `app.json`.
- Add folders: `src/components/`, `src/screens/`, `src/theme/`, `src/services/`.

### 2. Design System & Styling
- **Theme tokens** (`src/theme/colors.ts`) with HSL palettes for dark and light modes.
- **Glass‑morphism utilities** using `StyleSheet` with backdrop‑filter equivalents (`blur` from `expo-blur`).
- **Typography**: Google Font **Inter** via `expo-font`.
- Global component `ThemeProvider` using React Context to toggle dark/light.

### 3. Authentication Flow
- Install `@supabase/supabase-js`.
- Create `src/services/supabase.ts` initializing client with env vars.
- Screens: `LoginScreen.tsx`, `SignupScreen.tsx`, `PasswordResetScreen.tsx`.
- Store JWT securely using `expo-secure-store`.

### 4. Wellness Tracking Modules
- **EmotionTracker**: Emoji selector + optional journal entry → stored in Supabase table `emotions`.
- **ActivityTracker**: Manual entry or integration with Expo `Health` API for steps, workouts → table `activities`.
- **NutritionLogger**: Search with **Edamam API** (or placeholder) → table `nutrition`.
- **MindfulnessTimer**: Pomodoro‑style timer with soothing gradient animation.

### 5. AI Recommendation Engine
- Backend endpoint `/api/recommendations` (Node/Express) receives aggregated user data, calls **OpenAI Chat Completion** (`gpt-4o-mini`) with a prompt that generates a **personalized 4‑week wellness program** including culturally relevant African practices.
- Cache responses in Supabase (`recommendations` table) for 24 h.
- Frontend service `src/services/recommendation.ts` fetches from backend and displays via `RecommendationScreen.tsx`.

### 6. Real‑time Community Chat
- Use **Supabase Realtime** (`from('messages').on('INSERT')`) to implement a chat UI (`ChatScreen.tsx`).
- Messages include `region` field; UI filters by user’s selected African region.
- Create `src/components/RegionSelector.tsx` for users to set their region.

### 7. Backend Scaffold (`wellnest-backend/`)
- `npm init -y` → install `express`, `dotenv`, `openai`, `@supabase/supabase-js`, `cors`.
- Routes:
  - `POST /api/recommendations`
  - `GET /api/health` (simple health check)
- Environment variables (`.env`) for Supabase URL/Key and OpenAI API key.
- Deploy to **Render** (or Vercel serverless) – CI/CD via GitHub Actions.

### 8. GDPR & Privacy
- Add consent screen on first launch; store consent flag in Supabase.
- Implement data deletion endpoint (`DELETE /api/user/:id`).
- Ensure all API communications use HTTPS (handled by hosting).

### 9. CI/CD & Testing
- **GitHub Actions** workflow:
  - Lint (`eslint`, `prettier`).
  - Run unit tests (`jest` with `react-native-testing-library`).
  - Build Expo app (`expo export:web` for preview) and run `npm test` for backend.
- Deploy backend on push to `main`.

---

## Verification Plan

### Automated Tests
- **Frontend**: Jest + React Native Testing Library for each tracker component and auth flow.
- **Backend**: Supertest integration tests for recommendation endpoint (mock OpenAI response).
- **End‑to‑end**: Playwright testing on the Expo web preview: sign‑up → log emotions → receive AI program → post in chat → see real‑time update.

### Manual Checks
- Verify dark & light mode toggle with glass‑morphism effects on device.
- Confirm AI recommendations include African cultural practices.
- Test real‑time chat across two devices.
- Validate GDPR consent flow and ability to delete user data.

---

*Implementation will begin now by scaffolding the Expo project and backend.*
