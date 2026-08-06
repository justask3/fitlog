import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

export function StatsScreen() {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);

  return (
    <View style={styles.screen}>
      <Card>
        <Text style={styles.title}>Stats</Text>
        <Text style={styles.body}>Coming soon.</Text>
      </Card>
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
      padding: spacing.lg,
      paddingTop: 60,
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    body: {
      color: colors.textSecondary,
      fontFamily,
    },
  });
