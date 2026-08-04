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
  kind: text("kind").notNull(), // 'type' | 'group'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type CustomGroup = typeof customGroups.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutSet = typeof workoutSets.$inferSelect;
