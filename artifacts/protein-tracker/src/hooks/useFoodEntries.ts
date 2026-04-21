import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { FoodEntry } from "@/types";
import { useAuth } from "./useAuth";

export function useFoodEntries(date?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ["foodEntries", user?.id, date],
    queryFn: async (): Promise<FoodEntry[]> => {
      if (!user || !date) return [];
      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", date)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!date,
  });

  const addEntry = useMutation({
    mutationFn: async (entry: Omit<FoodEntry, "id" | "created_at" | "logged_at" | "user_id">) => {
      if (!user) throw new Error("No user");
      const { data, error } = await supabase
        .from("food_entries")
        .insert({
          ...entry,
          user_id: user.id,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries", user?.id, variables.date] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary", user?.id] });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async (data: { id: string; entry: Partial<FoodEntry> }) => {
      if (!user) throw new Error("No user");
      const { data: updated, error } = await supabase
        .from("food_entries")
        .update(data.entry)
        .eq("id", data.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries", user?.id, data.date] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary", user?.id] });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (data: { id: string; date: string }) => {
      if (!user) throw new Error("No user");
      const { error } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", data.id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries", user?.id, variables.date] });
      queryClient.invalidateQueries({ queryKey: ["weeklySummary", user?.id] });
    },
  });

  return {
    entries: entriesQuery.data || [],
    isLoading: entriesQuery.isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}

export function useWeeklySummary(startDate: string, endDate: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weeklySummary", user?.id, startDate, endDate],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;
      
      // Group by date
      const grouped = (data || []).reduce((acc: Record<string, number>, entry: FoodEntry) => {
        acc[entry.date] = (acc[entry.date] || 0) + entry.protein_per_serving;
        return acc;
      }, {});

      return grouped;
    },
    enabled: !!user,
  });
}
