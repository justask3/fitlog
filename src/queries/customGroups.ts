import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { db } from "@/db/client";
import { customGroups } from "@/db/schema";

export function useCustomGroups() {
  return useQuery({
    queryKey: ["customGroups"],
    queryFn: () => db.select().from(customGroups),
  });
}

export function useAddCustomGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      kind,
    }: {
      name: string;
      kind: "type" | "group" | "cardioActivity";
    }) => {
      await db.insert(customGroups).values({
        id: Crypto.randomUUID(),
        name,
        kind,
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customGroups"] });
    },
  });
}
