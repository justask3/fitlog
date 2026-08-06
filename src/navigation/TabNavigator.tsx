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
import { useTheme } from "@/theme/ThemeProvider";

export type TabParamList = {
  Home: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Owns the Start flow's "Workout type" modal (Strength/Cardio/custom),
 * triggered from HomeScreen's FAB (or a calendar day's "Add workout") via
 * the shared useStartFlow store. Strength/Cardio push real stack screens
 * (Muscle Group / Cardio Activity, see RootNavigator) so back navigation
 * genuinely steps back through the choices made; a custom type navigates
 * straight to Log Workout, same as today.
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

  const typeItems = [
    { key: "strength", label: "Strength", color: colors.primary },
    { key: "cardio", label: "Cardio", color: categoryColors.cardio },
    ...customTypeNames.map((name) => ({
      key: name,
      label: name,
      color: colors.textSecondary,
    })),
  ];

  const handleTypeSelect = (type: string) => {
    const date = flow.targetDate ?? undefined;
    if (type === "strength") {
      navigation.navigate("MuscleGroup", { workoutType: type, date });
    } else if (type === "cardio") {
      navigation.navigate("CardioActivity", { workoutType: type, date });
    } else {
      navigation.navigate("LogWorkout", {
        timerMode: settingsRow?.timerMode ?? "none",
        workoutType: type,
        date,
      });
    }
    flow.close();
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
        onClose={flow.close}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
