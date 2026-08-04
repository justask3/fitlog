import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { formatRelativeDate } from "@/queries/workouts";
import { colors, spacing, typography } from "@/theme";
import type { Workout } from "@/db/schema";

type LastActivityCardProps = {
  workout: Workout | undefined;
};

export function LastActivityCard({ workout }: LastActivityCardProps) {
  if (!workout) {
    return (
      <Card accessibilityLabel="No workouts yet">
        <Text style={styles.title}>No workouts yet</Text>
        <Text style={styles.muted}>Log one to get started.</Text>
      </Card>
    );
  }

  return (
    <Card accessibilityLabel="Last activity">
      <Text style={styles.label}>Last activity</Text>
      <Text style={styles.title}>
        {workout.mode === "quick" ? "Quick log" : "Workout"}
      </Text>
      <Text style={styles.muted}>{formatRelativeDate(workout.date)}</Text>
      {workout.note ? <Text style={styles.note}>{workout.note}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.microLabel,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.value,
    color: colors.textPrimary,
  },
  muted: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  note: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
