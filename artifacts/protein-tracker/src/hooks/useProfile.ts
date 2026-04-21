import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Record not found
          return null;
        }
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const createProfile = useMutation({
    mutationFn: async (data: { protein_goal: number; display_name: string }) => {
      if (!user) throw new Error("No user");
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: user.id,
          protein_goal: data.protein_goal,
          display_name: data.display_name,
        })
        .select()
        .single();

      if (error) throw error;
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: { protein_goal: number; display_name: string }) => {
      if (!user) throw new Error("No user");
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .update({
          protein_goal: data.protein_goal,
          display_name: data.display_name,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", user?.id], data);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    createProfile,
    updateProfile,
  };
}
