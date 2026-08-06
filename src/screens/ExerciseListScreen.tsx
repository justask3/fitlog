import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ExerciseListBody } from "@/components/ExerciseListBody";
import { useSettings } from "@/queries/settings";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";
import type { Exercise } from "@/db/schema";

export function ExerciseListScreen() {
  const { colors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { workoutType, muscleGroup, date } = route.params ?? {};
  const { data: settingsRow } = useSettings();

  const handleSelect = (exercise: Exercise) => {
    navigation.navigate("LogWorkout", {
      timerMode: settingsRow?.timerMode ?? "none",
      workoutType,
      muscleGroup,
      initialExerciseId: exercise.id,
      initialExerciseName: exercise.name,
      date,
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backRow}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>{muscleGroup} exercises</Text>

      <ExerciseListBody initialCategory={muscleGroup} onSelect={handleSelect} />
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
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      paddingTop: 60,
    },
    backRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      alignSelf: "flex-start",
    },
    backText: {
      color: colors.textSecondary,
      fontFamily,
      fontSize: 15,
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
      marginBottom: spacing.md,
      textTransform: "capitalize",
    },
  });
