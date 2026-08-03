import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initDatabase } from "@/db/client";
import { registerSyncListener } from "@/sync/syncQueue";
import { RootNavigator } from "@/navigation/RootNavigator";
import { colors } from "@/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setReady(true))
      .catch((e) => setError(e instanceof Error ? e : new Error(String(e))));

    const unsubscribe = registerSyncListener();
    return unsubscribe;
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Something went wrong setting up local storage. Restarting the app
          usually fixes this.
        </Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <RootNavigator />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.textPrimary,
    textAlign: "center",
    padding: 24,
  },
});
