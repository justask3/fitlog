import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type AvgVolumeCardProps = {
  volume: number;
  unit: "lb" | "kg";
};

export function AvgVolumeCard({ volume, unit }: AvgVolumeCardProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const rounded = Math.round(volume).toLocaleString();

  return (
    <Card accessibilityLabel={`Average volume per workout: ${rounded} ${unit}`}>
      <Text style={styles.label}>Avg volume</Text>
      <Text>
        <Text style={styles.value}>{rounded}</Text>
        <Text style={styles.unit}> {unit}</Text>
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
    label: {
      ...typography.microLabel,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    value: {
      ...typography.hero,
      color: colors.textPrimary,
    },
    unit: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily,
      color: colors.textSecondary,
    },
  });
