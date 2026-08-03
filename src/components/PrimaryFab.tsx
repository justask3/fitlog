import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme";

type PrimaryFabProps = {
  onPress: () => void;
  accessibilityLabel: string;
};

/** The single primary action on the home screen — logging a workout. */
export function PrimaryFab({ onPress, accessibilityLabel }: PrimaryFabProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={28} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  pressed: {
    opacity: 0.85,
  },
});
