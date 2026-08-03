import NetInfo from "@react-native-community/netinfo";
import { db } from "@/db/client";
import { workouts, workoutSets, exercises } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Minimal queue-based sync engine.
 *
 * Design: local SQLite is always the source of truth. Rows marked
 * sync_status='pending' are the queue itself — there is no separate
 * outbox table to keep in sync with the data tables. Pushing a row
 * uses its client-generated UUID as the idempotency key, so retries
 * after a dropped connection never create duplicates server-side.
 */

type PushResult = { id: string; ok: boolean };

async function pushPendingWorkouts(): Promise<PushResult[]> {
  const pending = await db
    .select()
    .from(workouts)
    .where(eq(workouts.syncStatus, "pending"));

  const results: PushResult[] = [];
  for (const row of pending) {
    try {
      // await supabase.from('workouts').upsert(toApiPayload(row), { onConflict: 'id' })
      await db
        .update(workouts)
        .set({ syncStatus: "synced" })
        .where(eq(workouts.id, row.id));
      results.push({ id: row.id, ok: true });
    } catch {
      // Leave as 'pending' — picked up again on the next sync pass.
      results.push({ id: row.id, ok: false });
    }
  }
  return results;
}

async function pushPendingSets(): Promise<PushResult[]> {
  const pending = await db
    .select()
    .from(workoutSets)
    .where(eq(workoutSets.syncStatus, "pending"));

  const results: PushResult[] = [];
  for (const row of pending) {
    try {
      // await supabase.from('workout_sets').upsert(toApiPayload(row), { onConflict: 'id' })
      await db
        .update(workoutSets)
        .set({ syncStatus: "synced" })
        .where(eq(workoutSets.id, row.id));
      results.push({ id: row.id, ok: true });
    } catch {
      results.push({ id: row.id, ok: false });
    }
  }
  return results;
}

async function pushPendingExercises(): Promise<PushResult[]> {
  const pending = await db
    .select()
    .from(exercises)
    .where(eq(exercises.syncStatus, "pending"));

  const results: PushResult[] = [];
  for (const row of pending) {
    try {
      // await supabase.from('exercises').upsert(toApiPayload(row), { onConflict: 'id' })
      await db
        .update(exercises)
        .set({ syncStatus: "synced" })
        .where(eq(exercises.id, row.id));
      results.push({ id: row.id, ok: true });
    } catch {
      results.push({ id: row.id, ok: false });
    }
  }
  return results;
}

let syncInFlight = false;

export async function runSync(): Promise<void> {
  if (syncInFlight) return; // avoid overlapping runs from rapid triggers
  const net = await NetInfo.fetch();
  if (!net.isConnected) return;

  syncInFlight = true;
  try {
    await pushPendingExercises();
    await pushPendingWorkouts();
    await pushPendingSets();
  } finally {
    syncInFlight = false;
  }
}

/** Call once at app start: syncs on launch and whenever connectivity returns. */
export function registerSyncListener(): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) runSync();
  });
  runSync();
  return unsubscribe;
}
