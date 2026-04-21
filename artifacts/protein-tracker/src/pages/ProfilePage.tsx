import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  protein_goal: z.coerce.number().min(10, "Goal must be at least 10g").max(500, "Goal seems too high"),
});

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { profile, isLoading, updateProfile } = useProfile();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      display_name: profile?.display_name || "",
      protein_goal: profile?.protein_goal || 150,
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile.mutateAsync(values);
      toast({ title: "Profile updated successfully" });
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/login");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account and settings.</p>
        </header>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-profile-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protein_goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Protein Goal (g)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} data-testid="input-profile-goal" />
                      </FormControl>
                      <FormDescription>Your daily target.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={updateProfile.isPending} data-testid="button-submit-profile">
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="pt-8 border-t border-border">
          <Button variant="destructive" variant-style="outline" className="w-full sm:w-auto" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </Layout>
  );
}
