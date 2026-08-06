import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type CardProps = ViewProps & {
  accent?: boolean; // green border, reserved for PR / celebratory moments
};

export function Card({ style, accent, children, ...rest }: CardProps) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

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

const makeStyles = (colors: { surface: string; accentBorder: string }) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      padding: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: "#0B2E33",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    accent: {
      borderWidth: 2,
      borderColor: colors.accentBorder,
    },
  });
