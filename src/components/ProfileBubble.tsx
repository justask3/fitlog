import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { colors, radius, spacing, typography } from "@/theme";

type ProfileBubbleProps = {
  name: string;
};

export function ProfileBubble({ name }: ProfileBubbleProps) {
  return (
    <Card style={styles.row} accessibilityLabel={`Profile: ${name}`}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
