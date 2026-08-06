import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { StepperField } from "./StepperField";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type CurrentWeightModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue: number;
  unit: "lb" | "kg";
  step: number;
};

export function CurrentWeightModal({
  visible,
  onClose,
  onSave,
  initialValue,
  unit,
  step,
}: CurrentWeightModalProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Current weight</Text>
          <StepperField
            label="Weight"
            suffix={unit}
            value={value}
            step={step}
            decimals={Number.isInteger(step) ? 0 : 1}
            onChange={setValue}
          />
          <Pressable
            onPress={handleSave}
            style={styles.saveButton}
            accessibilityRole="button"
            accessibilityLabel="Save current weight"
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
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
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.sm,
      alignItems: "center",
      marginTop: spacing.sm,
    },
    saveButtonText: {
      color: colors.white,
      fontWeight: "600",
      fontFamily,
    },
  });
