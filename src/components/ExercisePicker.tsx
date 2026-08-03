import React, { useState } from "react";
import { Modal, View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { useExercises } from "@/queries/workouts";
import { colors, radius, spacing, typography } from "@/theme";
import type { Exercise } from "@/db/schema";

type ExercisePickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
};

export function ExercisePicker({ visible, onClose, onSelect }: ExercisePickerProps) {
  const { data: exercises } = useExercises();
  const [query, setQuery] = useState("");

  const filtered = (exercises ?? []).filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose an exercise</Text>
        <TextInput
          style={styles.search}
          placeholder="Search exercises"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="Search exercises"
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => {
                onSelect(item);
                setQuery("");
              }}
              accessibilityRole="button"
              accessibilityLabel={item.name}
            >
              <Text style={styles.rowText}>{item.name}</Text>
              <Text style={styles.rowCategory}>{item.category}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No exercises match "{query}"</Text>
          }
        />
        <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button">
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

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
    marginBottom: spacing.md,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    height: 44,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowCategory: {
    fontSize: 12,
    color: colors.textMuted,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  closeButton: {
    alignItems: "center",
    padding: spacing.md,
  },
  closeText: {
    color: colors.primary,
    fontWeight: "500",
  },
});
