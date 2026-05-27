# Food Tracker — CLAUDE.md

Project conventions, architecture, and build context for Claude.

## Stack

- **Expo SDK 54** (the version in the iOS App Store Expo Go as of May 2026)
- React Native 0.81.5, React 19.1.0
- Expo Router ~6.0.23 (file-based routing, Stack navigator)
- expo-sqlite for local persistence
- react-native-svg for custom charts
- expo-image-picker for food photos
- expo-haptics for tactile feedback
- TypeScript, strict mode

## Three-Slice Plan

| Slice | What | Status |
|-------|------|--------|
| **1 — Logging + Streaks** | Food entry (name, meal type, photo), weight logging, streak/freeze system, close-the-day ritual, smooth weight trend chart | **Done** |
| 2 — Nutrition | USDA food search, calorie/macro tracking, nutrition ring + macro bars go live | Planned |
| 3 — AI Coaching | Weekly AI insights, meal suggestions, coaching nudges | Planned |

**Do not build Slices 2 or 3** unless explicitly told to.

## Design Direction

- Apple HIG warm-cream style: `bg: #F4F1EA`, white cards, soft shadows, generous radii (24-28px)
- System font (SF Pro on iOS), no custom fonts
- Four palette options: plum (default `#9B6F8E`), clay, sage, cobalt
- Tokens live in `constants/theme.ts`
- Design handoff reference files in `/tmp/design-files/food-tracker/project/`

## Engagement Rules

Every mechanic in the app rewards **logging**, never eating choices:
- Streak counts days with ≥1 meal AND weight logged (and day closed)
- Freezes save your streak on a missed day — earned every 7 real days, cap 3
- Milestones celebrate consistency (7d, 30d, 100d, 365d)
- No calorie judgments, no "good/bad" food labels
- The tone is encouraging and neutral: "close the day" is a quiet ritual, not a score

## Navigation

```
Stack (headerShown: false)
├── index        (Daily View — home)
├── weight       (Weight + Trend)
├── streak       (Streak Detail)
├── add-entry    (modal, slide_from_bottom)
├── log-weight   (modal, slide_from_bottom)
└── close-day    (modal, slide_from_bottom)
```

- Main screens share a custom `BottomNav` with 3 icons + centered FAB
- Main screens use `router.replace()` (flat navigation, no stack buildup)
- Modals use `router.push()` / `router.back()`

## Data Model (SQLite)

- **food_entries**: id, name, meal_type, date, time, photo_uri, created_at
- **weight_entries**: id, value, date (UNIQUE — one per day, upsert), created_at
- **day_status**: date (PK), is_closed, streak_count, freeze_used, closed_at

## Key Files

| Area | Files |
|------|-------|
| Tokens | `constants/theme.ts` |
| Types | `lib/types.ts` |
| Date helpers | `lib/dates.ts` |
| Database | `lib/db.ts` |
| Streak logic | `lib/streak.ts` |
| Chart math | `lib/catmull-rom.ts` |
| App context | `contexts/AppContext.tsx` |
| Data context | `contexts/DataContext.tsx` |
| UI primitives | `components/ui/*` |
| Screens | `app/index.tsx`, `app/weight.tsx`, `app/streak.tsx`, `app/add-entry.tsx`, `app/log-weight.tsx`, `app/close-day.tsx` |

## Deploy

- **iOS**: Expo Go (SDK 54) — `npx expo start` then scan QR
- **Web**: Vercel auto-deploys from `main` branch
  - Build command: `npx expo export -p web`
  - Output: `dist/`
  - Config: `vercel.json` with SPA rewrites
- **Node**: v24.16.0 via nvm

## Commands

```bash
npx expo start              # Dev server (iOS + web)
npx expo start --web        # Web only
npx expo export -p web      # Production web build
npx tsc --noEmit            # Type check
```

## Conventions

- All dates use `YYYY-MM-DD` format in local timezone
- All times use `HH:MM` format
- UUID v4 generated client-side (no server)
- One weight entry per day (upsert on conflict)
- Day "qualifies" for streak when: ≥1 food entry AND ≥1 weight entry AND day is closed
- Streak walks backward from yesterday; today counts too if closed
- `--legacy-peer-deps` is required for npm install (React 19 peer dep conflicts)
