import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { colors, spacing, typography } from "@/theme";

type StreakBadgeProps = {
  days: number;
};

export function StreakBadge({ days }: StreakBadgeProps) {
  const message =
    days > 0 ? "Log today to keep it going" : "Log a workout to start a streak";

  return (
    <Card style={styles.row} accessibilityLabel={`${days} day streak`}>
      <Ionicons name="flame" size={22} color="#BA7517" style={styles.icon} />
      <View>
        <Text style={styles.count}>{days} day streak</Text>
        <Text style={styles.subtext}>{message}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: spacing.md,
  },
  count: {
    ...typography.value,
    color: colors.textPrimary,
  },
  subtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
