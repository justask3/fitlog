import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRecentWorkouts, useWeekActivity } from "@/queries/workouts";
import { ProfileBubble } from "@/components/ProfileBubble";
import { LastActivityCard } from "@/components/LastActivityCard";
import { WeeklyActivityChart } from "@/components/WeeklyActivityChart";
import { PrimaryFab } from "@/components/PrimaryFab";
import { useStartFlow } from "@/store/useStartFlow";
import { colors, spacing } from "@/theme";

export function HomeScreen() {
  const startFlow = useStartFlow();
  const { data: recentWorkouts } = useRecentWorkouts(1);
  const { data: weekActivity } = useWeekActivity();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileBubble name="Justinas" />

        <View style={styles.halfRow}>
          <View style={styles.halfCard}>
            <LastActivityCard workout={recentWorkouts?.[0]} />
          </View>
        </View>

        <WeeklyActivityChart rows={weekActivity ?? []} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <PrimaryFab
          accessibilityLabel="Log a workout"
          onPress={() => startFlow.start()}
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
  halfRow: {
    flexDirection: "row",
  },
  halfCard: {
    width: "50%",
    paddingRight: spacing.sm,
  },
  fabContainer: {
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
  },
});
