import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "@/navigation/TabNavigator";
import { MuscleGroupScreen } from "@/screens/MuscleGroupScreen";
import { CardioActivityScreen } from "@/screens/CardioActivityScreen";
import { ExerciseListScreen } from "@/screens/ExerciseListScreen";
import { LogWorkoutScreen } from "@/screens/LogWorkoutScreen";
import type { TimerMode } from "@/queries/settings";

export type RootStackParamList = {
  Tabs: undefined;
  MuscleGroup: { workoutType: string; date?: number };
  CardioActivity: { workoutType: string; date?: number };
  ExerciseList: { workoutType: string; muscleGroup: string; date?: number };
  LogWorkout: {
    timerMode: TimerMode;
    workoutType?: string | null;
    muscleGroup?: string | null;
    cardioActivity?: string | null;
    initialExerciseId?: string;
    initialExerciseName?: string;
    /** epoch ms; absent means "now" — set when backfilling a workout for a specific calendar day. */
    date?: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="MuscleGroup" component={MuscleGroupScreen} />
        <Stack.Screen name="CardioActivity" component={CardioActivityScreen} />
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        <Stack.Screen
          name="LogWorkout"
          component={LogWorkoutScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
