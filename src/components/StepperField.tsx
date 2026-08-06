import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

type StepperFieldProps = {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  /** Decimal places to round/display to — 0 for reps, 1 for fractional weight increments. */
  decimals?: number;
};

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function StepperField({
  label,
  value,
  step,
  onChange,
  suffix,
  min = 0,
  decimals = 0,
}: StepperFieldProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState("");

  const adjust = (delta: number) => {
    onChange(Math.max(min, round(value + delta, decimals)));
  };

  const startEditing = () => {
    setDraftText(value.toFixed(decimals));
    setEditing(true);
  };

  const commitEdit = () => {
    const parsed = parseFloat(draftText);
    if (!Number.isNaN(parsed)) {
      onChange(Math.max(min, round(parsed, decimals)));
    }
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {suffix ? ` (${suffix})` : ""}
      </Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => adjust(-step)}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
        {editing ? (
          <TextInput
            style={styles.valueInput}
            value={draftText}
            onChangeText={setDraftText}
            onBlur={commitEdit}
            onSubmitEditing={commitEdit}
            keyboardType="decimal-pad"
            autoFocus
            selectTextOnFocus
            accessibilityLabel={`${label} value`}
          />
        ) : (
          <Pressable
            onPress={startEditing}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${label}, currently ${value.toFixed(decimals)}`}
          >
            <Text style={styles.value}>{value.toFixed(decimals)}</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => adjust(step)}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"],
  fontFamily: ReturnType<typeof useTheme>["fontFamily"]
) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.microLabel,
      color: colors.textSecondary,
      paddingBottom: spacing.xs,
      marginBottom: spacing.sm,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    button: {
      width: 44,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontFamily,
      fontSize: 18,
      color: colors.textPrimary,
    },
    value: {
      ...typography.hero,
      color: colors.textPrimary,
    },
    valueInput: {
      ...typography.hero,
      color: colors.textPrimary,
      minWidth: 80,
      textAlign: "center",
      padding: 0,
    },
  });
