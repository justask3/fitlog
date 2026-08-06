import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

export type PickerItem = { key: string; label: string; color: string };

type PickerListProps = {
  items: PickerItem[];
  onSelect: (key: string) => void;
  /** Omit to hide the "Add custom" row entirely — e.g. a fixed-option picker like Goal. */
  onAddCustom?: (name: string) => void;
};

/** Dot + label row list shared by modal pickers (GroupPickerModal) and full screens (MuscleGroupScreen, CardioActivityScreen). */
export function PickerList({ items, onSelect, onAddCustom }: PickerListProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed && onAddCustom) onAddCustom(trimmed);
    setName("");
    setAdding(false);
  };

  return (
    <View style={styles.list}>
      {onAddCustom &&
        (adding ? (
          <View style={styles.addForm}>
            <TextInput
              style={styles.addInput}
              placeholder="Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
              accessibilityLabel="Custom name"
            />
            <Pressable onPress={handleAdd} accessibilityRole="button" accessibilityLabel="Add">
              <Text style={styles.addConfirm}>Add</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.row}
            onPress={() => setAdding(true)}
            accessibilityRole="button"
            accessibilityLabel="Add custom"
          >
            <View style={styles.addDot}>
              <Text style={styles.addPlus}>+</Text>
            </View>
            <Text style={styles.rowLabel}>Add custom</Text>
          </Pressable>
        ))}

      {items.map((item) => (
        <Pressable
          key={item.key}
          style={styles.row}
          onPress={() => onSelect(item.key)}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.rowLabel}>{item.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
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
    list: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
    },
    dot: {
      width: 14,
      height: 14,
      borderRadius: radius.pill,
      marginRight: spacing.md,
    },
    addDot: {
      width: 14,
      height: 14,
      borderRadius: radius.pill,
      marginRight: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
    },
    addPlus: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: "700",
      lineHeight: 10,
    },
    rowLabel: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    chevron: {
      color: colors.textMuted,
      fontSize: 18,
    },
    addForm: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
    },
    addInput: {
      flex: 1,
      fontSize: 16,
      fontFamily,
      color: colors.textPrimary,
      paddingVertical: spacing.sm,
    },
    addConfirm: {
      color: colors.primary,
      fontWeight: "600",
      fontFamily,
    },
  });
