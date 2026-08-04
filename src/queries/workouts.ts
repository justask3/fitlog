import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { workouts, workoutSets, exercises } from "@/db/schema";
import { runSync } from "@/sync/syncQueue";
import type { DraftSet } from "@/store/useWorkoutDraft";

export function formatRelativeDate(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: () =>
      db
        .select()
        .from(exercises)
        .where(isNull(exercises.deletedAt))
        .orderBy(exercises.name),
  });
}

export function useRecentWorkouts(limit = 20) {
  return useQuery({
    queryKey: ["workouts", "recent", limit],
    queryFn: () =>
      db
        .select()
        .from(workouts)
        .where(isNull(workouts.deletedAt))
        .orderBy(desc(workouts.date))
        .limit(limit),
  });
}

/** One row per set logged in the last 7 days, with its exercise category, for the Home screen weekly chart. */
export function useWeekActivity() {
  return useQuery({
    queryKey: ["workouts", "week-activity"],
    queryFn: () => {
      const sevenDaysAgo = new Date(Date.now() - 6 * 86_400_000);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      return db
        .select({ date: workouts.date, category: exercises.category })
        .from(workoutSets)
        .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
        .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
        .where(
          and(
            isNull(workoutSets.deletedAt),
            isNull(workouts.deletedAt),
            gte(workouts.date, sevenDaysAgo)
          )
        );
    },
  });
}

/** Best-ever weight for an exercise, used to detect PRs when saving a new set. */
async function getBestWeightForExercise(exerciseId: string): Promise<number> {
  const rows = await db
    .select()
    .from(workoutSets)
    .where(
      and(eq(workoutSets.exerciseId, exerciseId), isNull(workoutSets.deletedAt))
    );
  return rows.reduce((max, r) => Math.max(max, r.weight ?? 0), 0);
}

type SaveWorkoutInput = {
  mode: "quick" | "structured";
  note: string;
  sets: DraftSet[];
  durationSeconds?: number;
};

export type SaveWorkoutResult = {
  workoutId: string;
  prs: { exerciseName: string; weight: number; previousBest: number }[];
};

export function useSaveWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SaveWorkoutInput): Promise<SaveWorkoutResult> => {
      const now = new Date();
      // Client-generated UUID: makes the save idempotent. Re-submitting the
      // same draft (e.g. after a flaky save) upserts the same row instead
      // of creating a duplicate workout.
      const workoutId = Crypto.randomUUID();

      const prs: SaveWorkoutResult["prs"] = [];

      await db.insert(workouts).values({
        id: workoutId,
        date: now,
        note: input.note || null,
        mode: input.mode,
        durationSeconds: input.durationSeconds ?? null,
        syncStatus: "pending",
        createdAt: now,
        updatedAt: now,
      });

      for (let i = 0; i < input.sets.length; i++) {
        const s = input.sets[i];
        const weight = parseFloat(s.weight) || 0;
        const reps = parseInt(s.reps, 10) || 0;

        const previousBest = await getBestWeightForExercise(s.exerciseId);
        if (weight > previousBest && previousBest > 0) {
          prs.push({ exerciseName: s.exerciseName, weight, previousBest });
        }

        await db.insert(workoutSets).values({
          id: Crypto.randomUUID(),
          workoutId,
          exerciseId: s.exerciseId,
          setOrder: i,
          reps,
          weight,
          weightUnit: s.weightUnit,
          syncStatus: "pending",
          createdAt: now,
          updatedAt: now,
        });
      }

      return { workoutId, prs };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      runSync(); // fire-and-forget; no-op if offline
    },
  });
}
