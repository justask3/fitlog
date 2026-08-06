import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { ExerciseListBody } from "./ExerciseListBody";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";
import type { Exercise } from "@/db/schema";

type ExercisePickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  /** Pre-filter to this category until the user types a search query. */
  initialCategory?: string;
  /** Pre-fill the search box with an exact exercise name (e.g. a cardio activity). */
  initialQuery?: string;
};

export function ExercisePicker({
  visible,
  onClose,
  onSelect,
  initialCategory,
  initialQuery,
}: ExercisePickerProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose an exercise</Text>
        {/* Remount on every open so a stale search query doesn't linger. */}
        <ExerciseListBody
          key={visible ? "open" : "closed"}
          onSelect={onSelect}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
        />
        <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button">
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
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
      padding: spacing.lg,
      paddingTop: 60,
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    closeButton: {
      alignItems: "center",
      padding: spacing.md,
    },
    closeText: {
      color: colors.primary,
      fontWeight: "500",
      fontFamily,
    },
  });
