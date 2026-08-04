import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { colors, categoryColors, categoryOrder, spacing, typography } from "@/theme";

type WeeklyActivityChartProps = {
  /** One entry per set logged, anywhere in the last 7 days. */
  rows: { date: Date; category: string }[];
};

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_MS = 86_400_000;
const MAX_BAR_HEIGHT = 72;
const MIN_BAR_HEIGHT = 4;

export function WeeklyActivityChart({ rows }: WeeklyActivityChartProps) {
  const today = Math.floor(Date.now() / DAY_MS);

  const days = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = today - 6 + i;
    const dayRows = rows.filter(
      (r) => Math.floor(r.date.getTime() / DAY_MS) === dayIndex
    );
    const segments = categoryOrder
      .map((category) => ({
        category,
        count: dayRows.filter((r) => r.category === category).length,
      }))
      .filter((s) => s.count > 0);
    return { dayIndex, total: dayRows.length, segments };
  });

  const maxTotal = Math.max(...days.map((d) => d.total));

  return (
    <Card accessibilityLabel="Last 7 days of activity, by exercise category">
      <Text style={styles.label}>Last 7 days</Text>
      <View style={styles.chartRow}>
        {days.map(({ dayIndex, total, segments }) => {
          const barHeight =
            maxTotal === 0 || total === 0
              ? MIN_BAR_HEIGHT
              : Math.max(MIN_BAR_HEIGHT, (total / maxTotal) * MAX_BAR_HEIGHT);
          const weekday = new Date(dayIndex * DAY_MS).getDay();

          return (
            <View key={dayIndex} style={styles.dayColumn}>
              <View style={[styles.bar, { height: MAX_BAR_HEIGHT }]}>
                {total === 0 ? (
                  <View style={[styles.stub, { height: MIN_BAR_HEIGHT }]} />
                ) : (
                  <View style={{ height: barHeight, flexDirection: "column-reverse" }}>
                    {segments.map((s, i) => (
                      <View
                        key={s.category}
                        style={[
                          styles.segment,
                          {
                            height: (s.count / total) * barHeight,
                            backgroundColor: categoryColors[s.category],
                            marginBottom: i < segments.length - 1 ? 2 : 0,
                          },
                          i === segments.length - 1 && styles.segmentTopRounded,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.dayLetter}>{WEEKDAY_LETTERS[weekday]}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        {categoryOrder.map((category) => (
          <View key={category} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: categoryColors[category] }]} />
            <Text style={styles.legendLabel}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.microLabel,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dayColumn: {
    alignItems: "center",
  },
  bar: {
    width: 24,
    justifyContent: "flex-end",
  },
  stub: {
    width: 24,
    borderRadius: 2,
    backgroundColor: colors.noActivity,
  },
  segment: {
    width: 24,
  },
  segmentTopRounded: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dayLetter: {
    marginTop: spacing.xs,
    fontSize: 11,
    color: colors.textMuted,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
