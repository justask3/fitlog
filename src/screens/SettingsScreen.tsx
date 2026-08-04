import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { colors, spacing, typography } from "@/theme";

export function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Card>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.body}>Coming soon.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
});
