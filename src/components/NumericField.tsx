import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

type NumericFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  suffix?: string;
  placeholder?: string;
};

export function NumericField({
  label,
  value,
  onChangeText,
  suffix,
  placeholder,
}: NumericFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label} accessibilityRole="text">
        {label}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={label}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDE4DA",
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  suffix: {
    ...typography.body,
    color: colors.textMuted,
  },
});
