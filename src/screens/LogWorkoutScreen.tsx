import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutDraft } from "@/store/useWorkoutDraft";
import type { DraftSet } from "@/store/useWorkoutDraft";
import { useSaveWorkout } from "@/queries/workouts";
import { useSettings } from "@/queries/settings";
import { Card } from "@/components/Card";
import { StepperField } from "@/components/StepperField";
import { PrCallout } from "@/components/PrCallout";
import { ExercisePicker } from "@/components/ExercisePicker";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { MONTH_NAMES } from "@/lib/calendarGrid";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";
import type { Exercise } from "@/db/schema";
import type { TimerMode } from "@/queries/settings";

type ModeToggleProps = {
  mode: "quick" | "structured";
  onChange: (mode: "quick" | "structured") => void;
  styles: ReturnType<typeof makeStyles>;
};

function ModeToggle({ mode, onChange, styles }: ModeToggleProps) {
  return (
    <View style={styles.toggleRow}>
      {(["structured", "quick"] as const).map((m) => (
        <Pressable
          key={m}
          onPress={() => onChange(m)}
          style={[styles.toggleButton, mode === m && styles.toggleButtonActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === m }}
        >
          <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
            {m === "structured" ? "Sets & reps" : "Quick note"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

type ExerciseLogCardProps = {
  exerciseName: string;
  sets: DraftSet[];
  weightUnit: "lb" | "kg";
  weightIncrement: number;
  onCommitSet: (weight: number, reps: number) => void;
  onRemoveSet: (localId: string) => void;
  onRemoveExercise: () => void;
  styles: ReturnType<typeof makeStyles>;
};

function ExerciseLogCard({
  exerciseName,
  sets,
  weightUnit,
  weightIncrement,
  onCommitSet,
  onRemoveSet,
  onRemoveExercise,
  styles,
}: ExerciseLogCardProps) {
  const { colors } = useTheme();
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  return (
    <Card>
      <View style={styles.setHeader}>
        <Text style={styles.exerciseName}>{exerciseName}</Text>
        <Pressable
          onPress={onRemoveExercise}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${exerciseName}`}
        >
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>

      <View style={styles.fieldStack}>
        <StepperField
          label="Weight"
          suffix={weightUnit}
          value={weight}
          step={weightIncrement}
          decimals={Number.isInteger(weightIncrement) ? 0 : 1}
          onChange={setWeight}
        />
        <StepperField label="Reps" value={reps} step={1} onChange={setReps} />
      </View>

      <View style={styles.saveClearRow}>
        <Pressable
          style={styles.saveSetButton}
          onPress={() => onCommitSet(weight, reps)}
          accessibilityRole="button"
          accessibilityLabel={`Save set for ${exerciseName}`}
        >
          <Text style={styles.saveSetText}>Save</Text>
        </Pressable>
        <Pressable
          style={styles.clearSetButton}
          onPress={() => {
            setWeight(0);
            setReps(0);
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear inputs"
        >
          <Text style={styles.clearSetText}>Clear</Text>
        </Pressable>
      </View>

      {sets.length === 0 ? (
        <Text style={styles.emptySets}>No sets logged yet</Text>
      ) : (
        <View style={styles.setList}>
          {sets.map((s, i) => (
            <View key={s.localId} style={styles.setRow}>
              <View style={styles.setBadge}>
                <Text style={styles.setBadgeText}>{i + 1}</Text>
              </View>
              <Text style={styles.setValue}>
                {s.weight} <Text style={styles.setUnit}>{s.weightUnit}</Text>
              </Text>
              <Text style={styles.setValue}>{s.reps} reps</Text>
              <Pressable
                onPress={() => onRemoveSet(s.localId)}
                accessibilityRole="button"
                accessibilityLabel={`Remove set ${i + 1}`}
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

export function LogWorkoutScreen() {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const timerMode: TimerMode = route.params?.timerMode ?? "none";
  const { workoutType, muscleGroup, cardioActivity, initialExerciseId, initialExerciseName, date } =
    route.params ?? {};
  const initialCategory: string | undefined =
    muscleGroup ?? (workoutType === "cardio" && !cardioActivity ? "cardio" : undefined);
  const { data: settingsRow } = useSettings();
  const defaultWeightUnit = (settingsRow?.weightUnit as "lb" | "kg") ?? "lb";
  const restSeconds = settingsRow?.restTimerSeconds ?? 90;
  const weightIncrement = settingsRow?.weightIncrement ?? 5;
  const draft = useWorkoutDraft();
  const saveWorkout = useSaveWorkout();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [savedPrs, setSavedPrs] = useState<
    { exerciseName: string; weight: number; previousBest: number }[]
  >([]);

  // Arriving from the Exercise List screen with a pre-picked exercise —
  // land already showing its card instead of blank. Re-navigating here
  // (e.g. after going back to pick a different exercise) reuses this same
  // screen instance and just updates params, so this re-runs per pick;
  // addExercise is idempotent, so re-picking the same one is a no-op.
  useEffect(() => {
    if (initialExerciseId && initialExerciseName) {
      draft.addExercise(initialExerciseId, initialExerciseName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialExerciseId, initialExerciseName]);

  // `date` is epoch-ms at UTC midnight of the tapped calendar day (see
  // lib/calendarGrid.ts's epoch scheme) — read with UTC getters so this
  // matches DayDetailModal's date label exactly, regardless of local timezone.
  const dateLabel =
    date != null
      ? (() => {
          const d = new Date(date);
          return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
        })()
      : null;

  const handleAddExercise = (exercise: Exercise) => {
    draft.addExercise(exercise.id, exercise.name);
    setPickerVisible(false);
  };

  const handleSave = async () => {
    if (draft.mode === "structured" && draft.sets.length === 0) {
      Alert.alert("Add a set first", "Log at least one exercise, or switch to Quick note.");
      return;
    }

    try {
      const result = await saveWorkout.mutateAsync({
        mode: draft.mode,
        note: draft.note,
        sets: draft.sets,
        durationSeconds: timerMode === "duration" ? durationSeconds : undefined,
        date: date != null ? new Date(date) : undefined,
      });
      setSavedPrs(result.prs);
      draft.reset();
      if (result.prs.length === 0) {
        navigation.popToTop();
      }
      // If there are PRs, stay on screen briefly to show the celebration
      // before the user navigates away themselves.
    } catch {
      Alert.alert(
        "Couldn't save the workout",
        "It's saved on this device and will retry automatically."
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Log a workout</Text>
            {dateLabel && <Text style={styles.dateSubtitle}>for {dateLabel}</Text>}
          </View>
          <Pressable
            onPress={() => navigation.popToTop()}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={8}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ModeToggle mode={draft.mode} onChange={draft.setMode} styles={styles} />

        {timerMode === "duration" && (
          <WorkoutTimer mode="duration" onTick={setDurationSeconds} />
        )}

        {savedPrs.map((pr) => (
          <PrCallout
            key={pr.exerciseName}
            exerciseName={pr.exerciseName}
            weight={pr.weight}
            previousBest={pr.previousBest}
          />
        ))}

        {draft.mode === "quick" ? (
          <Card>
            <Text style={styles.label}>What did you do?</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="e.g. 5k run, felt strong"
              placeholderTextColor={colors.textMuted}
              value={draft.note}
              onChangeText={draft.setNote}
              accessibilityLabel="Workout note"
            />
          </Card>
        ) : (
          <>
            {timerMode === "rest" && draft.sets.length > 0 && (
              <WorkoutTimer
                mode="rest"
                resetKey={draft.sets.length}
                restSeconds={restSeconds}
              />
            )}

            {draft.exercises.map((ex) => (
              <ExerciseLogCard
                key={ex.exerciseId}
                exerciseName={ex.exerciseName}
                sets={draft.sets.filter((s) => s.exerciseId === ex.exerciseId)}
                weightUnit={defaultWeightUnit}
                weightIncrement={weightIncrement}
                onCommitSet={(weight, reps) =>
                  draft.commitSet(ex.exerciseId, ex.exerciseName, weight, reps, defaultWeightUnit)
                }
                onRemoveSet={draft.removeSet}
                onRemoveExercise={() => draft.removeExercise(ex.exerciseId)}
                styles={styles}
              />
            ))}

            <Pressable
              style={styles.addExerciseButton}
              onPress={() => setPickerVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Add exercise"
            >
              <Text style={styles.addExerciseText}>+ Add exercise</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Pressable
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saveWorkout.isPending}
        accessibilityRole="button"
        accessibilityLabel="Save workout"
      >
        <Text style={styles.saveButtonText}>
          {saveWorkout.isPending ? "Saving…" : "Save workout"}
        </Text>
      </Pressable>

      <ExercisePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleAddExercise}
        initialCategory={initialCategory}
        initialQuery={cardioActivity ?? undefined}
      />
    </View>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: 100,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
    },
    dateSubtitle: {
      ...typography.microLabel,
      color: colors.textSecondary,
      marginTop: 2,
    },
    toggleRow: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      padding: 4,
      marginBottom: spacing.lg,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: "center",
      borderRadius: radius.pill,
    },
    toggleButtonActive: {
      backgroundColor: colors.primaryLight,
    },
    toggleText: {
      color: colors.textSecondary,
      fontWeight: "500",
      fontFamily,
    },
    toggleTextActive: {
      color: colors.textPrimary,
    },
    label: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    noteInput: {
      minHeight: 100,
      textAlignVertical: "top",
      color: colors.textPrimary,
      fontSize: 15,
      fontFamily,
    },
    setHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    exerciseName: {
      ...typography.value,
      color: colors.textPrimary,
    },
    remove: {
      color: colors.danger,
      fontSize: 13,
      fontFamily,
    },
    fieldStack: {
      flexDirection: "column",
    },
    saveClearRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    saveSetButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: radius.card,
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    saveSetText: {
      color: colors.white,
      fontWeight: "600",
      fontFamily,
    },
    clearSetButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      borderRadius: radius.card,
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    clearSetText: {
      color: colors.textSecondary,
      fontWeight: "600",
      fontFamily,
    },
    emptySets: {
      ...typography.microLabel,
      color: colors.textMuted,
      textAlign: "center",
      paddingVertical: spacing.sm,
    },
    setList: {
      borderTopWidth: 1,
      borderTopColor: colors.background,
      paddingTop: spacing.xs,
    },
    setRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.xs,
      gap: spacing.sm,
    },
    setBadge: {
      width: 22,
      height: 22,
      borderRadius: radius.pill,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    setBadgeText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: "700",
      fontFamily,
    },
    setValue: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    setUnit: {
      color: colors.textMuted,
      fontSize: 12,
      fontFamily,
    },
    addExerciseButton: {
      borderWidth: 1,
      borderColor: colors.primaryLight,
      borderRadius: radius.card,
      padding: spacing.md,
      alignItems: "center",
    },
    addExerciseText: {
      color: colors.primary,
      fontWeight: "500",
      fontFamily,
    },
    saveButton: {
      position: "absolute",
      bottom: spacing.xl,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: radius.card,
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    saveButtonText: {
      color: colors.white,
      fontWeight: "500",
      fontFamily,
      fontSize: 16,
    },
  });
