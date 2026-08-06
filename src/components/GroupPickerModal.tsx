import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PickerList, type PickerItem } from "./PickerList";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

export type { PickerItem };

type GroupPickerModalProps = {
  visible: boolean;
  title: string;
  items: PickerItem[];
  onSelect: (key: string) => void;
  /** Omit to hide the "Add custom" row entirely — e.g. a fixed-option picker like Goal. */
  onAddCustom?: (name: string) => void;
  onClose: () => void;
};

export function GroupPickerModal({
  visible,
  title,
  items,
  onSelect,
  onAddCustom,
  onClose,
}: GroupPickerModalProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {/* Remount on every open/close so a half-typed "Add custom" name doesn't linger. */}
        <PickerList
          key={visible ? "open" : "closed"}
          items={items}
          onSelect={onSelect}
          onAddCustom={onAddCustom}
        />

        <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button">
          <Text style={styles.closeText}>Cancel</Text>
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
      marginBottom: spacing.lg,
    },
    closeButton: {
      alignItems: "center",
      padding: spacing.md,
      marginTop: "auto",
    },
    closeText: {
      color: colors.primary,
      fontWeight: "500",
      fontFamily,
    },
  });
