import { create } from "zustand";

export type FlowStep = "type" | "group" | "timer" | null;

type StartFlowState = {
  step: FlowStep;
  workoutType: string | null;
  muscleGroup: string | null;
  start: () => void;
  selectType: (type: string) => void;
  selectGroup: (group: string) => void;
  cancel: () => void;
  reset: () => void;
};

const initialState = {
  step: null as FlowStep,
  workoutType: null as string | null,
  muscleGroup: null as string | null,
};

export const useStartFlow = create<StartFlowState>((set) => ({
  ...initialState,
  start: () => set({ step: "type", workoutType: null, muscleGroup: null }),
  selectType: (type) =>
    set({
      workoutType: type,
      step: type === "strength" ? "group" : "timer",
    }),
  selectGroup: (group) => set({ muscleGroup: group, step: "timer" }),
  cancel: () => set(initialState),
  reset: () => set(initialState),
}));
