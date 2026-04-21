import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfile } from "@/hooks/useProfile";
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
import { useToast } from "@/hooks/use-toast";

const onboardingSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  protein_goal: z.coerce.number().min(10, "Goal must be at least 10g").max(500, "Goal seems too high"),
});

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { profile, isLoading, createProfile } = useProfile();
  const { toast } = useToast();

  useEffect(() => {
    if (profile && !isLoading) {
      setLocation("/");
    }
  }, [profile, isLoading, setLocation]);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      display_name: "",
      protein_goal: 150,
    },
  });

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    try {
      await createProfile.mutateAsync(values);
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || profile) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to ProTracker</h1>
          <p className="text-muted-foreground">Let's set up your profile to get started.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What should we call you?</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} data-testid="input-onboarding-name" />
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
                      <Input type="number" placeholder="150" {...field} data-testid="input-onboarding-goal" />
                    </FormControl>
                    <FormDescription>You can change this later.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={createProfile.isPending}
                data-testid="button-submit-onboarding"
              >
                {createProfile.isPending ? "Saving..." : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
