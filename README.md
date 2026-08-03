# Fitness Log — Log a Workout scaffold

## What's implemented

- **Local-first SQLite** via `expo-sqlite` + Drizzle ORM (`src/db`), with
  `sync_status` and soft-delete columns on every table
- **Starter exercise library**, seeded on first launch (`src/db/seed.ts`)
- **Log a Workout** screen with dual-mode entry: structured sets/reps/weight,
  or a quick freeform note (`src/screens/LogWorkoutScreen.tsx`)
- **Idempotent saves** via client-generated UUIDs (`expo-crypto`), so a retried
  save after a dropped connection never creates a duplicate workout
- **PR detection**: comparing each saved set's weight against the historical
  best for that exercise, shown as a one-off celebration card — never per-set
- **Streak** computed from distinct workout dates, shown on the home screen
- **Sync queue skeleton** (`src/sync/syncQueue.ts`) — pushes pending rows when
  connectivity returns; the actual Supabase calls are stubbed as comments
  since a Supabase project isn't wired up yet
- Design tokens in `src/theme/index.ts` matching the sage/playful direction
  we locked in — treat this file as the single source of truth for styling

## Not yet implemented (on purpose)

- Supabase project + auth (the sync queue has commented-out call sites ready
  for `supabase.from(...).upsert(...)`)
- Delete/edit flows for a saved workout
- Exercise library management screen (add/delete custom exercises)
- Weight unit preference (currently defaults to lb per set)
- Tests

## Running it

1. Install [Node.js LTS](https://nodejs.org) if you don't have it.
2. In this folder:
   ```
   npm install
   npx expo start
   ```
3. Install **Expo Go** on your phone (App Store / Play Store).
4. Scan the QR code shown in the terminal with your phone's camera (iOS) or
   the Expo Go app (Android). Your phone and computer need to be on the same
   WiFi network — if that's a restrictive network (e.g. some office/school
   WiFi), run `npx expo start --tunnel` instead.

## Next steps I'd suggest

1. Wire up a real Supabase project and fill in the sync queue's upsert calls
2. Add the exercise library management screen (add/soft-delete custom
   exercises) — the schema already supports this
3. Add a "workout detail" screen so tapping a recent workout shows its full
   set list
