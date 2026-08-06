import React, { useMemo, useState } from "react";
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useCalendarActivity } from "@/queries/calendar";
import { useSettings } from "@/queries/settings";
import { getMonthsWindow, buildCategoriesByDay, type WeekStart } from "@/lib/calendarGrid";
import { useScrollToCurrentMonth } from "@/lib/useScrollToCurrentMonth";
import { CalendarMonthSection } from "@/components/CalendarMonthSection";
import { DayDetailModal } from "@/components/DayDetailModal";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CalendarModal({ visible, onClose }: CalendarModalProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const { data: rows } = useCalendarActivity();
  const { data: settingsRow } = useSettings();
  const weekStart = (settingsRow?.weekStart as WeekStart) ?? "sunday";
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const safeRows = rows ?? [];
  const categoriesByDay = useMemo(() => buildCategoriesByDay(safeRows), [safeRows]);
  const workoutCount = useMemo(
    () => new Set(safeRows.map((r) => r.workoutId)).size,
    [safeRows]
  );
  const monthsToShow = useMemo(() => getMonthsWindow(), []);
  const { scrollRef, registerMonthLayout } = useScrollToCurrentMonth(visible);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
          {monthsToShow.map(({ year, month }) => {
            const key = `${year}-${month}`;
            return (
              <View key={key} onLayout={registerMonthLayout(key)}>
                <CalendarMonthSection
                  year={year}
                  month={month}
                  weekStart={weekStart}
                  categoriesByDay={categoriesByDay}
                  onDayPress={setSelectedDay}
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {workoutCount} WORKOUT{workoutCount === 1 ? "" : "S"}
          </Text>
        </View>
      </View>

      <DayDetailModal epoch={selectedDay} onClose={() => setSelectedDay(null)} />
    </Modal>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: 60,
      paddingBottom: spacing.md,
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
    },
    closeText: {
      color: colors.primary,
      fontWeight: "500",
      fontFamily,
      fontSize: 12,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    footer: {
      alignItems: "center",
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.noActivity,
    },
    footerText: {
      ...typography.microLabel,
      color: colors.textSecondary,
    },
  });
