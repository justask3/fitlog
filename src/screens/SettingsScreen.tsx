import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { Card } from "@/components/Card";
import { useSettings, useUpdateSettings } from "@/queries/settings";
import { useGenerateDemoWorkouts } from "@/queries/demoData";
import { spacing, radius } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeMode } from "@/theme/ThemeProvider";
import type { FontStyle } from "@/queries/settings";

type PillOption = { value: string; label: string };

function PillSelector({
  options,
  value,
  onChange,
  styles,
}: {
  options: PillOption[];
  value: string;
  onChange: (v: string) => void;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.pillRow}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[styles.pillButton, value === opt.value && styles.pillButtonActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: value === opt.value }}
        >
          <Text style={[styles.pillText, value === opt.value && styles.pillTextActive]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function SettingsScreen() {
  const { colors, typography, fontFamily, themeMode, setThemeMode, fontStyle, setFontStyle } =
    useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const { data: settingsRow } = useSettings();
  const updateSettings = useUpdateSettings();
  const generateDemoWorkouts = useGenerateDemoWorkouts();

  const weightUnit = settingsRow?.weightUnit ?? "lb";
  const weekStart = settingsRow?.weekStart ?? "sunday";
  const weightIncrement = settingsRow?.weightIncrement ?? 5;
  const restTimerSeconds = settingsRow?.restTimerSeconds ?? 90;
  const timerMode = settingsRow?.timerMode ?? "none";

  const handleGenerateDemoData = () => {
    generateDemoWorkouts.mutate(undefined, {
      onSuccess: (count) => {
        Alert.alert("Demo data added", `Generated ${count} workouts over the last 2 months.`);
      },
      onError: () => {
        Alert.alert("Couldn't generate demo data", "Something went wrong — try again.");
      },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Settings</Text>

        <Card>
          <Text style={styles.sectionLabel}>Theme</Text>
          <PillSelector
            styles={styles}
            value={themeMode}
            onChange={(v) => setThemeMode(v as ThemeMode)}
            options={[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Style</Text>
          <PillSelector
            styles={styles}
            value={fontStyle}
            onChange={(v) => setFontStyle(v as FontStyle)}
            options={[
              { value: "default", label: "Default" },
              { value: "pixel", label: "Pixel" },
            ]}
          />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Unit system</Text>
          <PillSelector
            styles={styles}
            value={weightUnit}
            onChange={(v) => updateSettings.mutate({ weightUnit: v })}
            options={[
              { value: "lb", label: "lb" },
              { value: "kg", label: "kg" },
            ]}
          />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Calendar week start</Text>
          <PillSelector
            styles={styles}
            value={weekStart}
            onChange={(v) => updateSettings.mutate({ weekStart: v })}
            options={[
              { value: "sunday", label: "Sunday" },
              { value: "monday", label: "Monday" },
            ]}
          />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Default weight increment</Text>
          <PillSelector
            styles={styles}
            value={String(weightIncrement)}
            onChange={(v) => updateSettings.mutate({ weightIncrement: parseFloat(v) })}
            options={[1, 2.5, 5, 10].map((n) => ({
              value: String(n),
              label: `${n} ${weightUnit}`,
            }))}
          />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Timer settings</Text>
          <Text style={styles.sectionCaption}>Timer mode</Text>
          <PillSelector
            styles={styles}
            value={timerMode}
            onChange={(v) => updateSettings.mutate({ timerMode: v })}
            options={[
              { value: "none", label: "None" },
              { value: "duration", label: "Duration" },
              { value: "rest", label: "Rest" },
            ]}
          />
          <Text style={[styles.sectionCaption, styles.sectionCaptionSpaced]}>
            Default rest duration
          </Text>
          <PillSelector
            styles={styles}
            value={String(restTimerSeconds)}
            onChange={(v) => updateSettings.mutate({ restTimerSeconds: parseInt(v, 10) })}
            options={[30, 60, 90, 120].map((n) => ({
              value: String(n),
              label: `${n}s`,
            }))}
          />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Demo data</Text>
          <Text style={styles.sectionCaption}>
            Populate the last 2 months with random workouts, for trying out Avg Volume
            and the calendar.
          </Text>
          <Pressable
            onPress={handleGenerateDemoData}
            disabled={generateDemoWorkouts.isPending}
            style={styles.demoButton}
            accessibilityRole="button"
            accessibilityLabel="Generate demo workouts"
          >
            <Text style={styles.demoButtonText}>
              {generateDemoWorkouts.isPending ? "Generating…" : "Generate demo workouts"}
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingTop: 60,
      paddingBottom: 100,
    },
    screenTitle: {
      ...typography.title,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    sectionLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    sectionCaption: {
      fontSize: 12,
      fontFamily,
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },
    sectionCaptionSpaced: {
      marginTop: spacing.md,
    },
    demoButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    demoButtonText: {
      color: colors.white,
      fontWeight: "600",
      fontFamily,
    },
    pillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: colors.background,
      borderRadius: radius.pill,
      padding: 4,
      gap: 4,
    },
    pillButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
    },
    pillButtonActive: {
      backgroundColor: colors.primaryLight,
    },
    pillText: {
      color: colors.textSecondary,
      fontWeight: "500",
      fontFamily,
    },
    pillTextActive: {
      color: colors.textPrimary,
    },
  });
