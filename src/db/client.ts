import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";
import { STARTER_EXERCISES } from "./seed";

const sqlite = SQLite.openDatabaseSync("fitness-log.db");

export const db = drizzle(sqlite, { schema });

/**
 * Creates tables on first launch and seeds the starter exercise library.
 * Idempotent — safe to call on every app start.
 */
export async function initDatabase(): Promise<void> {
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      is_custom INTEGER NOT NULL DEFAULT 0,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      date INTEGER NOT NULL,
      note TEXT,
      mode TEXT NOT NULL DEFAULT 'structured',
      duration_seconds INTEGER,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS workout_sets (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      set_order INTEGER NOT NULL,
      reps INTEGER,
      weight REAL,
      weight_unit TEXT NOT NULL DEFAULT 'lb',
      sync_status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS custom_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sets_workout ON workout_sets(workout_id);
    CREATE INDEX IF NOT EXISTS idx_sets_exercise ON workout_sets(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
  `);

  const existing = await db.query.exercises.findFirst();
  if (!existing) {
    const now = new Date();
    for (const ex of STARTER_EXERCISES) {
      await db.insert(schema.exercises).values({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        isCustom: false,
        syncStatus: "synced", // ships with the app, nothing to push
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}
