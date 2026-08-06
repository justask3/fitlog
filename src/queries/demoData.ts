import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { workouts, workoutSets, exercises } from "@/db/schema";

const DAYS_BACK = 60;
const DAY_MS = 86_400_000;
const CHANCE_OF_WORKOUT = 0.55;

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Populates the last 60 days with plausible random workouts, for trying out Avg Volume / the calendar without weeks of real logging. */
export function useGenerateDemoWorkouts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<number> => {
      const allExercises = await db
        .select()
        .from(exercises)
        .where(isNull(exercises.deletedAt));
      if (allExercises.length === 0) return 0;

      let created = 0;

      for (let daysAgo = DAYS_BACK - 1; daysAgo >= 0; daysAgo--) {
        if (Math.random() > CHANCE_OF_WORKOUT) continue;

        const date = new Date(Date.now() - daysAgo * DAY_MS);
        date.setHours(randomInt(7, 19), randomInt(0, 59), 0, 0);

        const workoutId = Crypto.randomUUID();
        await db.insert(workouts).values({
          id: workoutId,
          date,
          note: null,
          mode: "structured",
          syncStatus: "pending",
          createdAt: date,
          updatedAt: date,
        });

        const picked = shuffled(allExercises).slice(0, randomInt(1, 4));
        let setOrder = 0;
        for (const exercise of picked) {
          const setCount = randomInt(2, 4);
          for (let i = 0; i < setCount; i++) {
            await db.insert(workoutSets).values({
              id: Crypto.randomUUID(),
              workoutId,
              exerciseId: exercise.id,
              setOrder: setOrder++,
              reps: randomInt(5, 15),
              weight: randomInt(20, 135),
              weightUnit: "lb",
              syncStatus: "pending",
              createdAt: date,
              updatedAt: date,
            });
          }
        }
        created++;
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}
