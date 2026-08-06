import React, { useState } from "react";
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
import { useWorkoutDraft } from "@/store/useWorkoutDraft";
import { useSaveWorkout } from "@/queries/workouts";
import { useSettings } from "@/queries/settings";
import { Card } from "@/components/Card";
import { StepperField } from "@/components/StepperField";
import { PrCallout } from "@/components/PrCallout";
import { ExercisePicker } from "@/components/ExercisePicker";
import { WorkoutTimer } from "@/components/WorkoutTimer";
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

export function LogWorkoutScreen() {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const timerMode: TimerMode = route.params?.timerMode ?? "none";
  const { workoutType, muscleGroup, cardioActivity } = route.params ?? {};
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

  const handleAddExercise = (exercise: Exercise) => {
    draft.addSet(exercise.id, exercise.name, defaultWeightUnit);
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
      });
      setSavedPrs(result.prs);
      draft.reset();
      if (result.prs.length === 0) {
        navigation.goBack();
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
        <Text style={styles.title}>Log a workout</Text>

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

            {draft.sets.map((s) => (
              <Card key={s.localId}>
                <View style={styles.setHeader}>
                  <Text style={styles.exerciseName}>{s.exerciseName}</Text>
                  <Pressable
                    onPress={() => draft.removeSet(s.localId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${s.exerciseName}`}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
                <View style={styles.fieldStack}>
                  <StepperField
                    label="Weight"
                    suffix={s.weightUnit}
                    value={parseFloat(s.weight) || 0}
                    step={weightIncrement}
                    decimals={Number.isInteger(weightIncrement) ? 0 : 1}
                    onChange={(v) => draft.updateSet(s.localId, { weight: String(v) })}
                  />
                  <StepperField
                    label="Reps"
                    value={parseInt(s.reps, 10) || 0}
                    step={1}
                    onChange={(v) => draft.updateSet(s.localId, { reps: String(v) })}
                  />
                </View>
              </Card>
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
    title: {
      ...typography.title,
      color: colors.textPrimary,
      marginBottom: spacing.md,
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
