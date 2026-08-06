import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Card } from "./Card";
import { spacing } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type DurationTimerProps = {
  mode: "duration";
  onTick: (seconds: number) => void;
};

type RestTimerProps = {
  mode: "rest";
  /** Change this (e.g. to draft.sets.length) to restart the countdown. */
  resetKey: number;
  /** Starting/reset countdown length, in seconds. */
  restSeconds: number;
};

export function WorkoutTimer(props: DurationTimerProps | RestTimerProps) {
  if (props.mode === "duration") {
    return <DurationTimer onTick={props.onTick} />;
  }
  return <RestTimer resetKey={props.resetKey} restSeconds={props.restSeconds} />;
}

function DurationTimer({ onTick }: { onTick: (seconds: number) => void }) {
  const { colors, typography } = useTheme();
  const styles = makeStyles(colors, typography);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    onTick(seconds);
  }, [seconds, onTick]);

  return (
    <Card accessibilityLabel={`Workout duration: ${formatClock(seconds)}`}>
      <Text style={styles.label}>Workout duration</Text>
      <Text style={styles.clock}>{formatClock(seconds)}</Text>
    </Card>
  );
}

function RestTimer({
  resetKey,
  restSeconds,
}: {
  resetKey: number;
  restSeconds: number;
}) {
  const { colors, typography } = useTheme();
  const styles = makeStyles(colors, typography);
  const [remaining, setRemaining] = useState(restSeconds);

  useEffect(() => {
    setRemaining(restSeconds);
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resetKey, restSeconds]);

  return (
    <Card accessibilityLabel={`Rest timer: ${formatClock(remaining)} remaining`}>
      <View style={styles.restRow}>
        <View>
          <Text style={styles.label}>Rest</Text>
          <Text style={styles.clock}>{formatClock(remaining)}</Text>
        </View>
        <Pressable
          onPress={() => setRemaining(0)}
          accessibilityRole="button"
          accessibilityLabel="Skip rest"
        >
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  typography: ReturnType<typeof useTheme>["typography"]
) =>
  StyleSheet.create({
    label: {
      ...typography.microLabel,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    clock: {
      ...typography.hero,
      color: colors.textPrimary,
    },
    restRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    skip: {
      color: colors.primary,
      fontWeight: "500",
    },
  });
