import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { colors, radius, spacing } from "@/theme";

type CardProps = ViewProps & {
  accent?: boolean; // green border, reserved for PR / celebratory moments
};

export function Card({ style, accent, children, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, accent && styles.accent, style]}
      accessibilityRole="summary"
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  accent: {
    borderWidth: 2,
    borderColor: colors.accentBorder,
  },
});
