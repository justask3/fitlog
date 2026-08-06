import { create } from "zustand";

export type FlowStep = "type" | "group" | "cardioActivity" | null;

type StartFlowState = {
  step: FlowStep;
  workoutType: string | null;
  muscleGroup: string | null;
  cardioActivity: string | null;
  start: () => void;
  /** strength -> Muscle Group step, cardio -> Cardio Activity step, anything else is terminal (caller navigates). */
  selectType: (type: string) => void;
  setMuscleGroup: (group: string) => void;
  setCardioActivity: (activity: string) => void;
  cancel: () => void;
  reset: () => void;
};

const initialState = {
  step: null as FlowStep,
  workoutType: null as string | null,
  muscleGroup: null as string | null,
  cardioActivity: null as string | null,
};

export const useStartFlow = create<StartFlowState>((set) => ({
  ...initialState,
  start: () => set({ ...initialState, step: "type" }),
  selectType: (type) =>
    set((state) => ({
      workoutType: type,
      step: type === "strength" ? "group" : type === "cardio" ? "cardioActivity" : state.step,
    })),
  setMuscleGroup: (group) => set({ muscleGroup: group }),
  setCardioActivity: (activity) => set({ cardioActivity: activity }),
  cancel: () => set(initialState),
  reset: () => set(initialState),
}));
