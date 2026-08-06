import { create } from "zustand";

export type DraftExercise = {
  exerciseId: string;
  exerciseName: string;
};

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
  exercises: DraftExercise[];
  sets: DraftSet[];
  setMode: (mode: WorkoutMode) => void;
  setNote: (note: string) => void;
  addExercise: (exerciseId: string, exerciseName: string) => void;
  removeExercise: (exerciseId: string) => void;
  commitSet: (
    exerciseId: string,
    exerciseName: string,
    weight: number,
    reps: number,
    weightUnit: "lb" | "kg"
  ) => void;
  removeSet: (localId: string) => void;
  reset: () => void;
};

const initialState = {
  mode: "structured" as WorkoutMode,
  note: "",
  exercises: [] as DraftExercise[],
  sets: [] as DraftSet[],
};

export const useWorkoutDraft = create<WorkoutDraftState>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setNote: (note) => set({ note }),
  addExercise: (exerciseId, exerciseName) =>
    set((state) =>
      state.exercises.some((e) => e.exerciseId === exerciseId)
        ? state
        : { exercises: [...state.exercises, { exerciseId, exerciseName }] }
    ),
  removeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e.exerciseId !== exerciseId),
      sets: state.sets.filter((s) => s.exerciseId !== exerciseId),
    })),
  commitSet: (exerciseId, exerciseName, weight, reps, weightUnit) =>
    set((state) => ({
      sets: [
        ...state.sets,
        {
          localId: `${Date.now()}-${state.sets.length}`,
          exerciseId,
          exerciseName,
          reps: String(reps),
          weight: String(weight),
          weightUnit,
        },
      ],
    })),
  removeSet: (localId) =>
    set((state) => ({ sets: state.sets.filter((s) => s.localId !== localId) })),
  reset: () => set(initialState),
}));
