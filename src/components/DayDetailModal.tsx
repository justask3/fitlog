import React from "react";
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useWorkoutsForDay, type DaySetRow } from "@/queries/calendar";
import { useStartFlow } from "@/store/useStartFlow";
import { MONTH_NAMES, DAY_MS } from "@/lib/calendarGrid";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type DayDetailModalProps = {
  epoch: number | null;
  onClose: () => void;
};

type ExerciseGroup = {
  exerciseName: string;
  category: string;
  sets: { weight: number | null; reps: number | null; weightUnit: string }[];
};

function groupByExercise(rows: DaySetRow[]): ExerciseGroup[] {
  const map = new Map<string, ExerciseGroup>();
  for (const r of rows) {
    const group = map.get(r.exerciseName);
    const set = { weight: r.weight, reps: r.reps, weightUnit: r.weightUnit };
    if (group) group.sets.push(set);
    else map.set(r.exerciseName, { exerciseName: r.exerciseName, category: r.category, sets: [set] });
  }
  return [...map.values()];
}

export function DayDetailModal({ epoch, onClose }: DayDetailModalProps) {
  const { colors, categoryColors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const { data: rows } = useWorkoutsForDay(epoch);
  const flow = useStartFlow();

  const dateLabel =
    epoch != null
      ? (() => {
          const d = new Date(epoch * DAY_MS);
          return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
        })()
      : "";

  const groups = groupByExercise(rows ?? []);

  const handleAddWorkout = () => {
    if (epoch == null) return;
    onClose();
    flow.start(epoch * DAY_MS);
  };

  return (
    <Modal visible={epoch != null} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{dateLabel}</Text>

          {groups.length === 0 ? (
            <Text style={styles.empty}>No workouts logged</Text>
          ) : (
            <ScrollView style={styles.list}>
              {groups.map((g) => (
                <View key={g.exerciseName} style={styles.exerciseGroup}>
                  <View style={styles.exerciseHeader}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: categoryColors[g.category as keyof typeof categoryColors] },
                      ]}
                    />
                    <Text style={styles.exerciseName}>{g.exerciseName}</Text>
                  </View>
                  {g.sets.map((s, i) => (
                    <Text key={i} style={styles.setLine}>
                      {s.weight ?? 0} {s.weightUnit} × {s.reps ?? 0} reps
                    </Text>
                  ))}
                </View>
              ))}
            </ScrollView>
          )}

          <Pressable
            style={styles.addButton}
            onPress={handleAddWorkout}
            accessibilityRole="button"
            accessibilityLabel="Add workout for this day"
          >
            <Text style={styles.addButtonText}>+ Add workout</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(11,20,22,0.4)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.card,
      borderTopRightRadius: radius.card,
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      maxHeight: "70%",
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    empty: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: "center",
      paddingVertical: spacing.lg,
    },
    list: {
      marginBottom: spacing.md,
    },
    exerciseGroup: {
      marginBottom: spacing.md,
    },
    exerciseHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: radius.pill,
      marginRight: spacing.sm,
    },
    exerciseName: {
      ...typography.value,
      color: colors.textPrimary,
    },
    setLine: {
      ...typography.body,
      color: colors.textSecondary,
      marginLeft: 18,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    addButtonText: {
      color: colors.white,
      fontWeight: "600",
      fontFamily,
    },
  });
