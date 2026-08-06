import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { PickerList } from "@/components/PickerList";
import { useCustomGroups, useAddCustomGroup } from "@/queries/customGroups";
import { useSettings } from "@/queries/settings";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

export function CardioActivityScreen() {
  const { colors, categoryColors, typography, fontFamily } = useTheme();
  const styles = makeStyles(colors, typography, fontFamily);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { workoutType, date } = route.params ?? {};
  const { data: customEntries } = useCustomGroups();
  const addCustom = useAddCustomGroup();
  const { data: settingsRow } = useSettings();

  const customActivityNames = (customEntries ?? [])
    .filter((g) => g.kind === "cardioActivity")
    .map((g) => g.name);

  const items = [
    { key: "Running", label: "Running", color: categoryColors.cardio },
    { key: "Cycling", label: "Cycling", color: categoryColors.cardio },
    ...customActivityNames.map((name) => ({ key: name, label: name, color: colors.textSecondary })),
  ];

  const handleSelect = (activity: string) => {
    navigation.navigate("LogWorkout", {
      timerMode: settingsRow?.timerMode ?? "none",
      workoutType,
      cardioActivity: activity,
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

      <Text style={styles.title}>Cardio activity</Text>

      <PickerList
        items={items}
        onSelect={handleSelect}
        onAddCustom={(name) => {
          addCustom.mutate({ name, kind: "cardioActivity" });
          handleSelect(name);
        }}
      />
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
      marginBottom: spacing.lg,
    },
  });
