import { useQuery } from "@tanstack/react-query";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { workouts, workoutSets, exercises } from "@/db/schema";

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
