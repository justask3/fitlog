import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Card } from "./Card";
import { CurrentWeightModal } from "./CurrentWeightModal";
import { GroupPickerModal } from "./GroupPickerModal";
import { useSettings, useUpdateSettings } from "@/queries/settings";
import type { GoalType } from "@/queries/settings";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type ProfileBubbleProps = {
  name: string;
};

const GOAL_LABELS: Record<GoalType, string> = {
  gain: "Gain weight",
  lose: "Lose weight",
  maintain: "Maintain",
};

export function ProfileBubble({ name }: ProfileBubbleProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const { data: settingsRow } = useSettings();
  const updateSettings = useUpdateSettings();
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const weightUnit = (settingsRow?.weightUnit as "lb" | "kg") ?? "lb";
  const weightIncrement = settingsRow?.weightIncrement ?? 5;
  // Defensive: guards against a stale/pre-migration settings row rendering
  // garbage instead of "Not set" (e.g. a device that hasn't cleared storage
  // since these columns were added).
  const rawWeight = settingsRow?.currentWeight;
  const currentWeight =
    typeof rawWeight === "number" && Number.isFinite(rawWeight) ? rawWeight : null;
  const rawGoal = settingsRow?.goalType;
  const goalType: GoalType | null =
    rawGoal === "gain" || rawGoal === "lose" || rawGoal === "maintain" ? rawGoal : null;

  const handleSaveError = (error: unknown) => {
    Alert.alert(
      "Couldn't save",
      `${error instanceof Error ? error.message : String(error)}\n\nIf this mentions a missing column, your device's local storage needs one more clear (Settings app -> Apps -> this app -> Storage -> Clear storage) to pick up a recent database change.`
    );
  };

  return (
    <>
      <Card>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
        </View>

        <Pressable
          style={styles.detailRow}
          onPress={() => setWeightModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Edit current weight"
        >
          <Text style={styles.detailLabel}>Current weight</Text>
          <View style={styles.detailValueRow}>
            <Text style={styles.detailValue}>
              {currentWeight != null ? `${currentWeight} ${weightUnit}` : "Not set"}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.detailRow, styles.detailRowLast]}
          onPress={() => setGoalModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Edit goal"
        >
          <Text style={styles.detailLabel}>Goal</Text>
          <View style={styles.detailValueRow}>
            <Text style={styles.detailValue}>{goalType ? GOAL_LABELS[goalType] : "Not set"}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      </Card>

      <CurrentWeightModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        onSave={(v) => {
          if (Number.isFinite(v)) {
            updateSettings.mutate({ currentWeight: v }, { onError: handleSaveError });
          }
        }}
        initialValue={currentWeight ?? 0}
        unit={weightUnit}
        step={weightIncrement}
      />

      <GroupPickerModal
        visible={goalModalVisible}
        title="Goal"
        items={[
          { key: "gain", label: "Gain weight", color: colors.primary },
          { key: "lose", label: "Lose weight", color: colors.primary },
          { key: "maintain", label: "Maintain", color: colors.primary },
        ]}
        onSelect={(key) => {
          updateSettings.mutate({ goalType: key }, { onError: handleSaveError });
          setGoalModalVisible(false);
        }}
        onClose={() => setGoalModalVisible(false)}
      />
    </>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    avatarLetter: {
      color: colors.white,
      fontSize: 18,
      fontFamily,
      fontWeight: "600",
    },
    name: {
      ...typography.title,
      color: colors.textPrimary,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.background,
    },
    detailRowLast: {
      marginBottom: -spacing.xs,
    },
    detailLabel: {
      ...typography.body,
      color: colors.textSecondary,
    },
    detailValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    detailValue: {
      ...typography.body,
      color: colors.textPrimary,
    },
    chevron: {
      color: colors.textMuted,
      fontSize: 18,
    },
  });
