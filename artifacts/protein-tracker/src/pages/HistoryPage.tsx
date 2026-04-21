import { useState, useMemo } from "react";
import { format, subDays, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  
  const { entries, isLoading } = useFoodEntries(dateStr);
  const { profile } = useProfile();

  const totalProtein = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.protein_per_serving, 0);
  }, [entries]);

  const goal = profile?.protein_goal || 150;
  const isGoalMet = totalProtein >= goal;

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

  return (
    <Layout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">History</h1>
          <p className="text-muted-foreground">Review your past logs.</p>
        </header>

        <div className="flex items-center justify-between bg-card border border-border p-4 rounded-2xl shadow-sm">
          <Button variant="ghost" size="icon" onClick={handlePrevDay} data-testid="button-prev-day">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-semibold text-lg">{isToday ? "Today" : format(selectedDate, "MMMM d, yyyy")}</h2>
            <p className="text-sm text-muted-foreground">{format(selectedDate, "EEEE")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextDay} disabled={isToday} data-testid="button-next-day">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {!isLoading && (
          <Card className={`border-none shadow-md ${isGoalMet ? 'bg-primary/10' : 'bg-secondary/30'}`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Protein</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tighter text-foreground">{Math.round(totalProtein)}g</span>
                  <span className="text-muted-foreground">/ {goal}g</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-medium text-sm ${isGoalMet ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {isGoalMet ? 'Goal Met' : 'Under Goal'}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Entries</h3>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border border-dashed text-muted-foreground">
              No foods logged for this date.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm"
                data-testid={`card-history-entry-${entry.id}`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{entry.food_name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.brand ? `${entry.brand} • ` : ""}
                    {entry.serving_size}{entry.serving_unit}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="font-bold text-lg text-primary">{Math.round(entry.protein_per_serving)}g</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
