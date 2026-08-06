import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/HomeScreen";
import { StatsScreen } from "@/screens/StatsScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { GroupPickerModal } from "@/components/GroupPickerModal";
import { useStartFlow } from "@/store/useStartFlow";
import { useCustomGroups, useAddCustomGroup } from "@/queries/customGroups";
import { useSettings } from "@/queries/settings";
import { categoryOrder } from "@/theme";
import { useTheme } from "@/theme/ThemeProvider";

export type TabParamList = {
  Home: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Owns the Start flow's modals (Workout Type -> Muscle Group/Cardio
 * Activity), triggered from HomeScreen's FAB via the shared useStartFlow
 * store. The flow navigates straight to Log Workout once a terminal choice
 * is made — timer mode comes from Settings, not a per-workout choice.
 */
export function TabNavigator() {
  const { colors, categoryColors } = useTheme();
  const navigation = useNavigation<any>();
  const flow = useStartFlow();
  const { data: customEntries } = useCustomGroups();
  const addCustom = useAddCustomGroup();
  const { data: settingsRow } = useSettings();

  const customTypeNames = (customEntries ?? [])
    .filter((g) => g.kind === "type")
    .map((g) => g.name);
  const customGroupNames = (customEntries ?? [])
    .filter((g) => g.kind === "group")
    .map((g) => g.name);
  const customCardioActivityNames = (customEntries ?? [])
    .filter((g) => g.kind === "cardioActivity")
    .map((g) => g.name);

  const typeItems = [
    { key: "strength", label: "Strength", color: colors.primary },
    { key: "cardio", label: "Cardio", color: categoryColors.cardio },
    ...customTypeNames.map((name) => ({
      key: name,
      label: name,
      color: colors.textSecondary,
    })),
  ];
  const groupItems = [
    ...categoryOrder
      .filter((c) => c !== "cardio")
      .map((c) => ({ key: c, label: c, color: categoryColors[c] })),
    ...customGroupNames.map((name) => ({
      key: name,
      label: name,
      color: colors.textSecondary,
    })),
  ];
  const cardioActivityItems = [
    { key: "Running", label: "Running", color: categoryColors.cardio },
    { key: "Cycling", label: "Cycling", color: categoryColors.cardio },
    ...customCardioActivityNames.map((name) => ({
      key: name,
      label: name,
      color: colors.textSecondary,
    })),
  ];

  const goToLogWorkout = (extra: {
    workoutType: string | null;
    muscleGroup?: string | null;
    cardioActivity?: string | null;
  }) => {
    navigation.navigate("LogWorkout", {
      timerMode: settingsRow?.timerMode ?? "none",
      ...extra,
    });
    flow.reset();
  };

  const handleTypeSelect = (type: string) => {
    if (type === "strength" || type === "cardio") {
      flow.selectType(type);
    } else {
      goToLogWorkout({ workoutType: type });
    }
  };

  const handleGroupSelect = (group: string) => {
    flow.setMuscleGroup(group);
    goToLogWorkout({ workoutType: flow.workoutType, muscleGroup: group });
  };

  const handleCardioActivitySelect = (activity: string) => {
    flow.setCardioActivity(activity);
    goToLogWorkout({ workoutType: flow.workoutType, cardioActivity: activity });
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

      <GroupPickerModal
        visible={flow.step === "type"}
        title="Workout type"
        items={typeItems}
        onSelect={handleTypeSelect}
        onAddCustom={(name) => {
          addCustom.mutate({ name, kind: "type" });
          handleTypeSelect(name);
        }}
        onClose={flow.cancel}
      />

      <GroupPickerModal
        visible={flow.step === "group"}
        title="Muscle group"
        items={groupItems}
        onSelect={handleGroupSelect}
        onAddCustom={(name) => {
          addCustom.mutate({ name, kind: "group" });
          handleGroupSelect(name);
        }}
        onClose={flow.cancel}
      />

      <GroupPickerModal
        visible={flow.step === "cardioActivity"}
        title="Cardio activity"
        items={cardioActivityItems}
        onSelect={handleCardioActivitySelect}
        onAddCustom={(name) => {
          addCustom.mutate({ name, kind: "cardioActivity" });
          handleCardioActivitySelect(name);
        }}
        onClose={flow.cancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
