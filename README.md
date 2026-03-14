# Decode Your Strength

**Live app:** [https://muscle-strength-psi.vercel.app/](https://muscle-strength-psi.vercel.app/)

Conference booth web app for Entelo Bio.

Visitors enter a grip dynamometer score and receive:
- muscle age
- percentile vs population norms
- celebrity tier match
- cell identity match
- educational factoid
- optional leaderboard placement

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Zustand (state + localStorage persistence)
- canvas-confetti

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Optional environment setup

```bash
cp .env.example .env
```

The app runs without any required secrets. `.env` keys are optional branding/integration values.

### 3) Run in development

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

### 4) Production build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - type-check and build production bundle
- `npm run preview` - preview built app locally
- `npm run lint` - run ESLint

## How the App Works

## Screen Flow

1. **Welcome**
   - Branded landing screen with animated background.
2. **Profile**
   - Required: name, age, sex.
   - Optional: company, email.
3. **Grip Entry**
   - Up to 3 attempts.
   - Best attempt is used for result calculations.
4. **Loading Reveal (3s)**
   - Deliberate reveal animation.
   - Confetti for strong results.
5. **Results**
   - Muscle age, percentile, celebrity tier, cell identity, rotating factoid.
   - Buttons for leaderboard, replay, email modal.
6. **Leaderboard**
   - Top results for the current device/browser storage.
   - Staff reset requires a confirmation tap.

## Core Calculation Logic

Implemented in `src/utils/calculations.ts`:
- `getPercentile(grip, age, sex)`:
  - Uses sex-specific age bands and p5/p25/p50/p75/p95 values.
  - Piecewise linear interpolation to estimate continuous percentile.
- `getMuscleAge(grip, sex)`:
  - Compares grip against median (p50) trend across age bands.
  - Interpolates to a smooth age-equivalent score.
- `calculateResult(...)`:
  - Returns best grip, percentile, muscle age, celebrity tier, and cell type.

## Data Sources in Code

- Grip norms: `src/data/gripNorms.ts`
- Celebrity tiers: `src/data/celebrityTiers.ts`
- Cell types: `src/data/cellTypes.ts`
- Educational factoids: `src/data/factoids.ts`

## Persistence

- Leaderboard is stored in browser `localStorage`.
- Key is managed inside `src/hooks/useGameStore.ts`.
- Data is local to that device/browser unless a backend is added.

## Booth Operation Notes

- Recommended display: fullscreen/kiosk mode.
- Results/leaderboard screens auto-reset to welcome after 60 seconds of inactivity.
- Staff can use the top-right reset control to restart quickly between visitors.
- Leaderboard reset button has a confirm step to reduce accidental clears.

## Screenshot/Capture Mode

Use:

```text
http://localhost:5173/?capture=1
```

This hides the particle background for cleaner screenshot capture.

## Project Structure

```text
src/
  components/      # reusable UI (e.g. particle background)
  data/            # norms, tiers, factoids
  hooks/           # Zustand store
  pages/           # screen-level components
  types/           # TypeScript domain types
  utils/           # pure calculation helpers
```

## Next Improvements (Optional)

- Add backend persistence (Supabase/Firebase) for cross-device leaderboard.
- Replace QR placeholder with real QR asset/link.
- Wire email modal to an API endpoint for outbound report emails.
