import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { CalendarModal } from "./CalendarModal";
import { CalendarMonthSection } from "./CalendarMonthSection";
import { DayDetailModal } from "./DayDetailModal";
import { useCalendarActivity } from "@/queries/calendar";
import { useSettings } from "@/queries/settings";
import { getMonthsWindow, buildCategoriesByDay, type WeekStart } from "@/lib/calendarGrid";
import { useScrollToCurrentMonth } from "@/lib/useScrollToCurrentMonth";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

const PREVIEW_HEIGHT = 300;

export function CalendarBubble() {
  const { colors, typography } = useTheme();
  const styles = makeStyles(colors, typography);
  const [visible, setVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data: rows } = useCalendarActivity();
  const { data: settingsRow } = useSettings();
  const weekStart = (settingsRow?.weekStart as WeekStart) ?? "sunday";

  const safeRows = rows ?? [];
  const categoriesByDay = useMemo(() => buildCategoriesByDay(safeRows), [safeRows]);
  const monthsToShow = useMemo(() => getMonthsWindow(), []);
  const { scrollRef, registerMonthLayout } = useScrollToCurrentMonth(true);

  return (
    <>
      <Card>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Calendar</Text>
          <Pressable
            onPress={() => setVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Open full-screen calendar"
          >
            <Ionicons name="expand-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Dragging still scrolls as normal — day cells only respond to a quick tap. */}
        <ScrollView ref={scrollRef} style={styles.preview} nestedScrollEnabled>
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
      </Card>

      <CalendarModal visible={visible} onClose={() => setVisible(false)} />
      <DayDetailModal epoch={selectedDay} onClose={() => setSelectedDay(null)} />
    </>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"]
) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    title: {
      ...typography.value,
      color: colors.textPrimary,
    },
    preview: {
      height: PREVIEW_HEIGHT,
    },
  });
