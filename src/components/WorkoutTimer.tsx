import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Card } from "./Card";
import { colors, spacing, typography } from "@/theme";

const REST_SECONDS = 90;

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
};

export function WorkoutTimer(props: DurationTimerProps | RestTimerProps) {
  if (props.mode === "duration") {
    return <DurationTimer onTick={props.onTick} />;
  }
  return <RestTimer resetKey={props.resetKey} />;
}

function DurationTimer({ onTick }: { onTick: (seconds: number) => void }) {
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

function RestTimer({ resetKey }: { resetKey: number }) {
  const [remaining, setRemaining] = useState(REST_SECONDS);

  useEffect(() => {
    setRemaining(REST_SECONDS);
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
  }, [resetKey]);

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

const styles = StyleSheet.create({
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
