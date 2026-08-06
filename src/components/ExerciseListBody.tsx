import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { useExercises } from "@/queries/workouts";
import { radius, spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";
import type { Exercise } from "@/db/schema";

type ExerciseListBodyProps = {
  onSelect: (exercise: Exercise) => void;
  /** Pre-filter to this category until the user types a search query. */
  initialCategory?: string;
  /** Pre-fill the search box with an exact exercise name (e.g. a cardio activity). */
  initialQuery?: string;
};

/** Search box + exercise list, shared by the "+ Add exercise" modal and the full-screen Exercise List step of the Start flow. */
export function ExerciseListBody({ onSelect, initialCategory, initialQuery }: ExerciseListBodyProps) {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const { data: exercises } = useExercises();
  const [query, setQuery] = useState(initialQuery ?? "");

  const filtered = (exercises ?? []).filter((e) => {
    if (query) return e.name.toLowerCase().includes(query.toLowerCase());
    if (initialCategory) return e.category === initialCategory;
    return true;
  });

  return (
    <>
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
          <Text style={styles.empty}>
            {query
              ? `No exercises match "${query}"`
              : "No exercises in this category yet — try searching"}
          </Text>
        }
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
    search: {
      backgroundColor: colors.surface,
      borderRadius: radius.input,
      height: 44,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      fontFamily,
      color: colors.textPrimary,
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
      fontFamily,
      color: colors.textMuted,
    },
    empty: {
      fontFamily,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: spacing.xl,
    },
  });
