import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

export type PickerItem = { key: string; label: string; color: string };

type GroupPickerModalProps = {
  visible: boolean;
  title: string;
  items: PickerItem[];
  onSelect: (key: string) => void;
  onAddCustom: (name: string) => void;
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
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed) onAddCustom(trimmed);
    setName("");
    setAdding(false);
  };

  const handleClose = () => {
    setAdding(false);
    setName("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.grid}>
          {adding ? (
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
              <Pressable
                onPress={handleAdd}
                accessibilityRole="button"
                accessibilityLabel="Add"
              >
                <Text style={styles.addConfirm}>Add</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.bubble}
              onPress={() => setAdding(true)}
              accessibilityRole="button"
              accessibilityLabel="Add custom"
            >
              <View style={[styles.circle, styles.addCircle]}>
                <Text style={styles.addPlus}>+</Text>
              </View>
              <Text style={styles.bubbleLabel}>Add</Text>
            </Pressable>
          )}

          {items.map((item) => (
            <Pressable
              key={item.key}
              style={styles.bubble}
              onPress={() => onSelect(item.key)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={[styles.circle, { backgroundColor: item.color }]}>
                <Text style={styles.circleLetters}>
                  {item.label.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          accessibilityRole="button"
        >
          <Text style={styles.closeText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const BUBBLE_SIZE = 64;

const styles = StyleSheet.create({
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  bubble: {
    width: 80,
    alignItems: "center",
  },
  circle: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  circleLetters: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  addCircle: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderStyle: "dashed",
  },
  addPlus: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "300",
  },
  bubbleLabel: {
    ...typography.microLabel,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  addForm: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: BUBBLE_SIZE,
    width: "100%",
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  addConfirm: {
    color: colors.primary,
    fontWeight: "600",
  },
  closeButton: {
    alignItems: "center",
    padding: spacing.md,
    marginTop: "auto",
  },
  closeText: {
    color: colors.primary,
    fontWeight: "500",
  },
});
