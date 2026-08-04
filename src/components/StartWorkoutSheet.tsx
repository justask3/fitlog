import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

export type TimerMode = "none" | "duration" | "rest";

type StartWorkoutSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mode: TimerMode) => void;
};

const OPTIONS: { mode: TimerMode; label: string; description: string }[] = [
  { mode: "none", label: "No timer", description: "Just log sets and reps" },
  {
    mode: "duration",
    label: "Track duration",
    description: "Time the whole workout",
  },
  {
    mode: "rest",
    label: "Rest timer",
    description: "Countdown between sets",
  },
];

export function StartWorkoutSheet({
  visible,
  onClose,
  onSelect,
}: StartWorkoutSheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Start a workout</Text>
          {OPTIONS.map((option) => (
            <Pressable
              key={option.mode}
              style={styles.option}
              onPress={() => onSelect(option.mode)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            accessibilityRole="button"
          >
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(11,20,22,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  optionLabel: {
    ...typography.value,
    color: colors.textPrimary,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    alignItems: "center",
    paddingTop: spacing.md,
  },
  closeText: {
    color: colors.primary,
    fontWeight: "500",
  },
});
