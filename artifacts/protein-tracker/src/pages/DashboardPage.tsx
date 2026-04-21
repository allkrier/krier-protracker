import { useMemo } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { profile, isLoading: profileLoading } = useProfile();
  const { entries, isLoading: entriesLoading, deleteEntry } = useFoodEntries(today);
  const { toast } = useToast();

  const totalProtein = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.protein_per_serving, 0);
  }, [entries]);

  const goal = profile?.protein_goal || 150;
  const progressPercentage = Math.min(Math.round((totalProtein / goal) * 100), 100);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteEntry.mutateAsync({ id, date: today });
        toast({ title: "Entry deleted" });
      } catch (error: any) {
        toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
      }
    }
  };

  if (profileLoading || entriesLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Today</h1>
            <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
          </div>
          <Link href="/log" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" data-testid="button-add-food-header">
            <Plus className="w-4 h-4 mr-2" />
            Log Food
          </Link>
        </header>

        <Card className="border-none shadow-md bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* SVG Circular Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-secondary stroke-current"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-primary stroke-current transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${progressPercentage * 2.51327} 251.327`}
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-foreground" data-testid="text-total-protein">{Math.round(totalProtein)}g</span>
                <span className="text-sm text-muted-foreground">of {goal}g</span>
              </div>
            </div>
            
            <div className="mt-8 w-full max-w-xs">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-medium">Daily Progress</span>
                <span className="font-semibold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today's Log</h2>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border border-dashed">
              <p className="text-muted-foreground mb-4">No food logged today.</p>
              <Link href="/log" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2" data-testid="button-add-first-food">
                Log your first meal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm hover-elevate transition-all group"
                  data-testid={`card-entry-${entry.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{entry.food_name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.brand ? `${entry.brand} • ` : ""}
                      {entry.serving_size}{entry.serving_unit}
                      {entry.calories_per_serving ? ` • ${Math.round(entry.calories_per_serving)} kcal` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <span className="font-bold text-lg text-primary">{Math.round(entry.protein_per_serving)}g</span>
                    </div>
                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(entry.id)} data-testid={`button-delete-${entry.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
