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
        <Text>
          <Text style={styles.count}>{days}</Text>
          <Text style={styles.unit}> day{days === 1 ? "" : "s"} streak</Text>
        </Text>
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
    ...typography.hero,
    color: colors.textPrimary,
  },
  unit: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  subtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
