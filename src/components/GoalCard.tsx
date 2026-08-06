import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { useSettings } from "@/queries/settings";
import type { GoalType } from "@/queries/settings";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

const GOAL_LABELS: Record<GoalType, string> = {
  gain: "Gain weight",
  lose: "Lose weight",
  maintain: "Maintain",
};

export function GoalCard() {
  const { colors, typography } = useTheme();
  const styles = makeStyles(colors, typography);
  const { data: settingsRow } = useSettings();
  // Defensive: same guard as ProfileBubble — a stale/pre-migration settings
  // row shouldn't be able to render as anything but "not set".
  const rawGoal = settingsRow?.goalType;
  const goalType: GoalType | null =
    rawGoal === "gain" || rawGoal === "lose" || rawGoal === "maintain" ? rawGoal : null;

  return (
    <Card accessibilityLabel={goalType ? `Goal: ${GOAL_LABELS[goalType]}` : "Goal: not set"}>
      <Text style={styles.label}>Goal</Text>
      <Text style={styles.body}>{goalType ? GOAL_LABELS[goalType] : "Coming soon"}</Text>
    </Card>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"]
) =>
  StyleSheet.create({
    label: {
      ...typography.microLabel,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    body: {
      ...typography.value,
      color: colors.textSecondary,
    },
  });
