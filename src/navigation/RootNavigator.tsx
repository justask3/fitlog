import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "@/navigation/TabNavigator";
import { LogWorkoutScreen } from "@/screens/LogWorkoutScreen";
import type { TimerMode } from "@/queries/settings";

export type RootStackParamList = {
  Tabs: undefined;
  LogWorkout: {
    timerMode: TimerMode;
    workoutType?: string | null;
    muscleGroup?: string | null;
    cardioActivity?: string | null;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen
          name="LogWorkout"
          component={LogWorkoutScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
