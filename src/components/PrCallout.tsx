import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { colors, spacing, typography } from "@/theme";

type PrCalloutProps = {
  exerciseName: string;
  weight: number;
  previousBest: number;
  weightUnit?: string;
};

/**
 * Reserved for genuine personal records only — never shown per-set.
 * Overusing celebration dilutes it; see design-language notes.
 */
export function PrCallout({
  exerciseName,
  weight,
  previousBest,
  weightUnit = "lb",
}: PrCalloutProps) {
  const delta = weight - previousBest;

  return (
    <Card accent accessibilityLabel={`New personal record: ${exerciseName}`}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color="#3B6D11" />
        <Text style={styles.headerText}>New heaviest yet</Text>
      </View>
      <Text style={styles.value}>
        {exerciseName} · {weight} {weightUnit}{" "}
        <Text style={styles.delta}>+{delta} {weightUnit}</Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  headerText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  value: {
    ...typography.value,
    color: colors.textPrimary,
  },
  delta: {
    fontSize: 13,
    color: colors.primary,
  },
});
