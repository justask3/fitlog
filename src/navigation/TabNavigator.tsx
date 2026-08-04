import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/HomeScreen";
import { StatsScreen } from "@/screens/StatsScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { StartWorkoutSheet, type TimerMode } from "@/components/StartWorkoutSheet";
import { GroupPickerModal } from "@/components/GroupPickerModal";
import { useStartFlow } from "@/store/useStartFlow";
import { useCustomGroups, useAddCustomGroup } from "@/queries/customGroups";
import { colors, categoryColors, categoryOrder, radius } from "@/theme";

const BUILT_IN_TYPES = [
  { key: "strength", label: "Strength", color: colors.primary },
  { key: "cardio", label: "Cardio", color: categoryColors.cardio },
];

const BUILT_IN_GROUPS = categoryOrder
  .filter((c) => c !== "cardio")
  .map((c) => ({ key: c, label: c, color: categoryColors[c] }));

export type TabParamList = {
  Home: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * The "Start" action is a floating button that breaks through the tab bar
 * (matching the reference design) rather than a real tab slot — it opens a
 * sheet, it never has a selected/active state of its own.
 */
export function TabNavigator() {
  const navigation = useNavigation<any>();
  const flow = useStartFlow();
  const { data: customEntries } = useCustomGroups();
  const addCustom = useAddCustomGroup();

  const customTypeNames = (customEntries ?? [])
    .filter((g) => g.kind === "type")
    .map((g) => g.name);
  const customGroupNames = (customEntries ?? [])
    .filter((g) => g.kind === "group")
    .map((g) => g.name);

  const typeItems = [
    ...BUILT_IN_TYPES,
    ...customTypeNames.map((name) => ({
      key: name,
      label: name,
      color: colors.textSecondary,
    })),
  ];
  const groupItems = [
    ...BUILT_IN_GROUPS,
    ...customGroupNames.map((name) => ({
      key: name,
      label: name,
      color: colors.textSecondary,
    })),
  ];

  const handleTimerSelect = (mode: TimerMode) => {
    navigation.navigate("LogWorkout", {
      timerMode: mode,
      workoutType: flow.workoutType,
      muscleGroup: flow.muscleGroup,
    });
    flow.reset();
  };

  return (
    <View style={styles.fill}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      <Pressable
        style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
        onPress={() => flow.start()}
        accessibilityRole="button"
        accessibilityLabel="Start a workout"
      >
        <Ionicons name="play" size={26} color={colors.white} />
      </Pressable>

      <GroupPickerModal
        visible={flow.step === "type"}
        title="Workout type"
        items={typeItems}
        onSelect={flow.selectType}
        onAddCustom={(name) => {
          addCustom.mutate({ name, kind: "type" });
          flow.selectType(name);
        }}
        onClose={flow.cancel}
      />

      <GroupPickerModal
        visible={flow.step === "group"}
        title="Muscle group"
        items={groupItems}
        onSelect={flow.selectGroup}
        onAddCustom={(name) => {
          addCustom.mutate({ name, kind: "group" });
          flow.selectGroup(name);
        }}
        onClose={flow.cancel}
      />

      <StartWorkoutSheet
        visible={flow.step === "timer"}
        onClose={flow.cancel}
        onSelect={handleTimerSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  startButton: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
