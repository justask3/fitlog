import { useQuery } from "@tanstack/react-query";
import { and, eq, gte, isNull, lt } from "drizzle-orm";
import { db } from "@/db/client";
import { workouts, workoutSets, exercises } from "@/db/schema";
import { DAY_MS } from "@/lib/calendarGrid";

/** One row per set ever logged, with its date/category/workout — small enough at this app's scale to fetch unbounded. */
export function useCalendarActivity() {
  return useQuery({
    queryKey: ["calendar", "activity"],
    queryFn: () =>
      db
        .select({
          date: workouts.date,
          category: exercises.category,
          workoutId: workouts.id,
        })
        .from(workoutSets)
        .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
        .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
        .where(and(isNull(workoutSets.deletedAt), isNull(workouts.deletedAt))),
  });
}

export type DaySetRow = {
  workoutId: string;
  exerciseName: string;
  category: string;
  weight: number | null;
  reps: number | null;
  weightUnit: string;
  setOrder: number;
};

/** Every set logged on a single calendar day (epoch = ms since epoch / DAY_MS), for the day-detail sheet. */
export function useWorkoutsForDay(epoch: number | null) {
  return useQuery({
    queryKey: ["calendar", "day", epoch],
    enabled: epoch != null,
    queryFn: async (): Promise<DaySetRow[]> => {
      const dayStart = new Date(epoch! * DAY_MS);
      const dayEnd = new Date((epoch! + 1) * DAY_MS);
      return db
        .select({
          workoutId: workouts.id,
          exerciseName: exercises.name,
          category: exercises.category,
          weight: workoutSets.weight,
          reps: workoutSets.reps,
          weightUnit: workoutSets.weightUnit,
          setOrder: workoutSets.setOrder,
        })
        .from(workoutSets)
        .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
        .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
        .where(
          and(
            isNull(workoutSets.deletedAt),
            isNull(workouts.deletedAt),
            gte(workouts.date, dayStart),
            lt(workouts.date, dayEnd)
          )
        )
        .orderBy(workoutSets.setOrder);
    },
  });
}
