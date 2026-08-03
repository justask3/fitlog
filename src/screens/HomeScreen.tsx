import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRecentWorkouts } from "@/queries/workouts";
import { Card } from "@/components/Card";
import { StreakBadge } from "@/components/StreakBadge";
import { PrimaryFab } from "@/components/PrimaryFab";
import { colors, spacing, typography } from "@/theme";

function formatRelativeDate(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/** Consecutive-day streak, computed from distinct workout dates. */
function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((d) => Math.floor(d.getTime() / 86_400_000)));
  let streak = 0;
  let cursor = Math.floor(Date.now() / 86_400_000);
  while (days.has(cursor)) {
    streak++;
    cursor--;
  }
  return streak;
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { data: workouts, isLoading } = useRecentWorkouts();

  const streak = computeStreak((workouts ?? []).map((w) => w.date));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Hey, Justinas</Text>

        <StreakBadge days={streak} />

        <Text style={styles.sectionLabel}>Recent workouts</Text>

        {isLoading && <Text style={styles.muted}>Loading…</Text>}

        {!isLoading && (workouts ?? []).length === 0 && (
          <Card accessibilityLabel="No workouts logged yet">
            <Text style={styles.emptyTitle}>Start your first workout</Text>
            <Text style={styles.muted}>
              Tap the button below to log a set or a quick note.
            </Text>
          </Card>
        )}

        {(workouts ?? []).map((w) => (
          <Card key={w.id}>
            <View style={styles.rowBetween}>
              <Text style={styles.workoutTitle}>
                {w.mode === "quick" ? "Quick log" : "Workout"}
              </Text>
              <Text style={styles.muted}>{formatRelativeDate(w.date)}</Text>
            </View>
            {w.note ? <Text style={styles.note}>{w.note}</Text> : null}
          </Card>
        ))}
      </ScrollView>

      <View style={styles.fabContainer}>
        <PrimaryFab
          accessibilityLabel="Log a workout"
          onPress={() => navigation.navigate("LogWorkout")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  greeting: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.microLabel,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  emptyTitle: {
    ...typography.value,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  muted: {
    fontSize: 12,
    color: colors.textMuted,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  workoutTitle: {
    ...typography.body,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  note: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  fabContainer: {
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
  },
});
