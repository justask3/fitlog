import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Every table carries:
 * - id: client-generated UUID (idempotency across sync retries)
 * - sync_status: 'pending' | 'synced' | 'conflict'
 * - deleted_at: soft delete marker (never hard-delete synced rows)
 * - updated_at: last local write, used for conflict resolution
 */

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g. "chest", "legs", "cardio"
  isCustom: integer("is_custom", { mode: "boolean" }).notNull().default(false),
  syncStatus: text("sync_status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  note: text("note"), // quick journal mode: freeform text, sets can be empty
  mode: text("mode").notNull().default("structured"), // 'quick' | 'structured'
  durationSeconds: integer("duration_seconds"), // set only when logged in "duration" timer mode
  syncStatus: text("sync_status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const workoutSets = sqliteTable("workout_sets", {
  id: text("id").primaryKey(),
  workoutId: text("workout_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  setOrder: integer("set_order").notNull(),
  reps: integer("reps"),
  weight: real("weight"),
  weightUnit: text("weight_unit").notNull().default("lb"), // 'lb' | 'kg'
  syncStatus: text("sync_status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

/**
 * User-added Start-flow picker labels (custom workout types / muscle groups).
 * Deliberately minimal — no sync columns, since these are local picker
 * labels, not content bound for the eventual Supabase sync.
 */
export const customGroups = sqliteTable("custom_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull(), // 'type' | 'group' | 'cardioActivity'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/**
 * Single-row local preferences (id is always "singleton"). No sync columns —
 * same reasoning as custom_groups: local settings, not synced content.
 */
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  themeMode: text("theme_mode").notNull().default("system"), // 'system' | 'light' | 'dark'
  weightUnit: text("weight_unit").notNull().default("lb"), // 'lb' | 'kg'
  weekStart: text("week_start").notNull().default("sunday"), // 'sunday' | 'monday'
  weightIncrement: real("weight_increment").notNull().default(5),
  restTimerSeconds: integer("rest_timer_seconds").notNull().default(90),
  timerMode: text("timer_mode").notNull().default("none"), // 'none' | 'duration' | 'rest'
  fontStyle: text("font_style").notNull().default("default"), // 'default' | 'pixel'
  currentWeight: real("current_weight"), // null = not set
  goalType: text("goal_type"), // 'gain' | 'lose' | 'maintain' | null = not set
});

export type Exercise = typeof exercises.$inferSelect;
export type CustomGroup = typeof customGroups.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutSet = typeof workoutSets.$inferSelect;
