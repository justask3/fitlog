import { create } from "zustand";

export type DraftSet = {
  localId: string; // temp key for list rendering, distinct from DB id
  exerciseId: string;
  exerciseName: string;
  reps: string;
  weight: string;
  weightUnit: "lb" | "kg";
};

type WorkoutMode = "quick" | "structured";

type WorkoutDraftState = {
  mode: WorkoutMode;
  note: string;
  sets: DraftSet[];
  setMode: (mode: WorkoutMode) => void;
  setNote: (note: string) => void;
  addSet: (exerciseId: string, exerciseName: string) => void;
  updateSet: (localId: string, patch: Partial<DraftSet>) => void;
  removeSet: (localId: string) => void;
  reset: () => void;
};

const initialState = {
  mode: "structured" as WorkoutMode,
  note: "",
  sets: [] as DraftSet[],
};

export const useWorkoutDraft = create<WorkoutDraftState>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setNote: (note) => set({ note }),
  addSet: (exerciseId, exerciseName) =>
    set((state) => ({
      sets: [
        ...state.sets,
        {
          localId: `${Date.now()}-${state.sets.length}`,
          exerciseId,
          exerciseName,
          reps: "",
          weight: "",
          weightUnit: "lb",
        },
      ],
    })),
  updateSet: (localId, patch) =>
    set((state) => ({
      sets: state.sets.map((s) => (s.localId === localId ? { ...s, ...patch } : s)),
    })),
  removeSet: (localId) =>
    set((state) => ({ sets: state.sets.filter((s) => s.localId !== localId) })),
  reset: () => set(initialState),
}));
