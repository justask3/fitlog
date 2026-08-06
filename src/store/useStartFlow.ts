import { create } from "zustand";

type StartFlowState = {
  /** Whether the Workout Type modal (Strength/Cardio/custom) is open. */
  step: "type" | null;
  /** epoch ms of the day being logged for, if started from a calendar day's "Add workout" — null means today. */
  targetDate: number | null;
  start: (date?: number) => void;
  close: () => void;
};

export const useStartFlow = create<StartFlowState>((set) => ({
  step: null,
  targetDate: null,
  start: (date) => set({ step: "type", targetDate: date ?? null }),
  close: () => set({ step: null, targetDate: null }),
}));
