import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

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
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const delta = weight - previousBest;

  return (
    <Card accent accessibilityLabel={`New personal record: ${exerciseName}`}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={colors.primary} />
        <Text style={styles.headerText}>New heaviest yet</Text>
      </View>
      <Text style={styles.value}>
        {exerciseName} · {weight} {weightUnit}{" "}
        <Text style={styles.delta}>+{delta} {weightUnit}</Text>
      </Text>
    </Card>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
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
      fontFamily,
      color: colors.primary,
    },
  });
