import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import type { Settings } from "@/db/schema";

export type TimerMode = "none" | "duration" | "rest";
export type FontStyle = "default" | "pixel";
export type GoalType = "gain" | "lose" | "maintain";

const SINGLETON_ID = "singleton";

async function getOrCreateSettings(): Promise<Settings> {
  const existing = await db.query.settings.findFirst();
  if (existing) return existing;

  const row: Settings = {
    id: SINGLETON_ID,
    themeMode: "system",
    weightUnit: "lb",
    weekStart: "sunday",
    weightIncrement: 5,
    restTimerSeconds: 90,
    timerMode: "none",
    fontStyle: "default",
    currentWeight: null,
    goalType: null,
  };
  await db.insert(settings).values(row);
  return row;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getOrCreateSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patch: Partial<Omit<Settings, "id">>) => {
      await getOrCreateSettings();
      await db.update(settings).set(patch).where(eq(settings.id, SINGLETON_ID));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
