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
import { useNavigation } from "@react-navigation/native";
import { useWorkoutDraft } from "@/store/useWorkoutDraft";
import { useSaveWorkout } from "@/queries/workouts";
import { Card } from "@/components/Card";
import { NumericField } from "@/components/NumericField";
import { PrCallout } from "@/components/PrCallout";
import { ExercisePicker } from "@/components/ExercisePicker";
import { colors, radius, spacing, typography } from "@/theme";
import type { Exercise } from "@/db/schema";

type ModeToggleProps = {
  mode: "quick" | "structured";
  onChange: (mode: "quick" | "structured") => void;
};

function ModeToggle({ mode, onChange }: ModeToggleProps) {
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
  const navigation = useNavigation<any>();
  const draft = useWorkoutDraft();
  const saveWorkout = useSaveWorkout();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [savedPrs, setSavedPrs] = useState<
    { exerciseName: string; weight: number; previousBest: number }[]
  >([]);

  const handleAddExercise = (exercise: Exercise) => {
    draft.addSet(exercise.id, exercise.name);
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

        <ModeToggle mode={draft.mode} onChange={draft.setMode} />

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
                <View style={styles.fieldRow}>
                  <NumericField
                    label="Weight"
                    value={s.weight}
                    onChangeText={(v) => draft.updateSet(s.localId, { weight: v })}
                    suffix={s.weightUnit}
                    placeholder="0"
                  />
                  <View style={{ width: spacing.md }} />
                  <NumericField
                    label="Reps"
                    value={s.reps}
                    onChangeText={(v) => draft.updateSet(s.localId, { reps: v })}
                    placeholder="0"
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  fieldRow: {
    flexDirection: "row",
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
    fontSize: 16,
  },
});
