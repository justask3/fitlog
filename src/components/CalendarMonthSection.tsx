import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  MONTH_NAMES,
  buildMonthGrid,
  weekdayLabels,
  DAY_MS,
  type WeekStart,
} from "@/lib/calendarGrid";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

const MAX_DOTS = 4;

type CalendarMonthSectionProps = {
  year: number;
  month: number;
  weekStart: WeekStart;
  categoriesByDay: Map<number, string[]>;
};

export function CalendarMonthSection({
  year,
  month,
  weekStart,
  categoriesByDay,
}: CalendarMonthSectionProps) {
  const { colors, categoryColors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const labels = weekdayLabels(weekStart);
  const todayEpoch = Math.floor(Date.now() / DAY_MS);

  return (
    <View style={styles.monthSection}>
      <Text style={styles.monthLabel}>
        {MONTH_NAMES[month]} {year}
      </Text>
      <View style={styles.weekRow}>
        {labels.map((label, i) => (
          <View key={i} style={styles.dayCell}>
            <Text style={styles.weekdayLabel}>{label}</Text>
          </View>
        ))}
      </View>
      {buildMonthGrid(year, month, weekStart).map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((cell, ci) => (
            <View key={ci} style={styles.dayCell}>
              {cell && (
                <>
                  <Text
                    style={[
                      styles.dayNumber,
                      cell.epoch === todayEpoch && styles.dayNumberToday,
                    ]}
                  >
                    {cell.day}
                  </Text>
                  <View style={styles.dotsRow}>
                    {(categoriesByDay.get(cell.epoch) ?? [])
                      .slice(0, MAX_DOTS)
                      .map((category, di) => (
                        <View
                          key={di}
                          style={[
                            styles.dot,
                            {
                              backgroundColor:
                                categoryColors[category as keyof typeof categoryColors],
                            },
                          ]}
                        />
                      ))}
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    monthSection: {
      marginBottom: spacing.xl,
    },
    monthLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    weekRow: {
      flexDirection: "row",
    },
    dayCell: {
      width: "14.28%",
      alignItems: "center",
      paddingVertical: spacing.xs,
    },
    weekdayLabel: {
      fontSize: 9,
      fontWeight: "600",
      fontFamily,
      color: colors.textMuted,
    },
    dayNumber: {
      fontSize: 9,
      fontFamily,
      color: colors.textPrimary,
      width: "100%",
      textAlign: "center",
    },
    dayNumberToday: {
      fontWeight: "700",
      color: colors.primary,
    },
    dotsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignSelf: "stretch",
      marginTop: 2,
      gap: 2,
      minHeight: 8,
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 3,
    },
  });
