import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useAverageVolume, useWeekActivity } from "@/queries/workouts";
import { useSettings } from "@/queries/settings";
import { ProfileBubble } from "@/components/ProfileBubble";
import { AvgVolumeCard } from "@/components/AvgVolumeCard";
import { GoalCard } from "@/components/GoalCard";
import { CalendarBubble } from "@/components/CalendarBubble";
import { WeeklyActivityChart } from "@/components/WeeklyActivityChart";
import { PrimaryFab } from "@/components/PrimaryFab";
import { useStartFlow } from "@/store/useStartFlow";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const startFlow = useStartFlow();
  const { data: settingsRow } = useSettings();
  const weightUnit = (settingsRow?.weightUnit as "lb" | "kg") ?? "lb";
  const { data: avgVolume } = useAverageVolume(weightUnit);
  const { data: weekActivity } = useWeekActivity();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileBubble name="Justinas" />

        <View style={styles.halfRow}>
          <View style={styles.halfCard}>
            <AvgVolumeCard volume={avgVolume ?? 0} unit={weightUnit} />
          </View>
          <View style={styles.halfCard}>
            <GoalCard />
          </View>
        </View>

        <WeeklyActivityChart rows={weekActivity ?? []} />

        <CalendarBubble />
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

const makeStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
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
      gap: spacing.sm,
    },
    halfCard: {
      flex: 1,
    },
    fabContainer: {
      position: "absolute",
      bottom: spacing.xl,
      left: 0,
      right: 0,
    },
  });
