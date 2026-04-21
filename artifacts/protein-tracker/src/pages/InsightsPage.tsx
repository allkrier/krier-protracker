import { useMemo } from "react";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";
import { useWeeklySummary } from "@/hooks/useFoodEntries";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsPage() {
  const today = startOfDay(new Date());
  const weekAgo = subDays(today, 6);
  
  const startDate = format(weekAgo, "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const { data: summaryData, isLoading } = useWeeklySummary(startDate, endDate);
  const { profile } = useProfile();

  const goal = profile?.protein_goal || 150;

  const chartData = useMemo(() => {
    if (!summaryData) return [];
    
    const days = eachDayOfInterval({ start: weekAgo, end: today });
    return days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      const protein = summaryData[dateStr] || 0;
      return {
        date: format(day, "EEE"),
        fullDate: dateStr,
        protein: Math.round(protein),
        isMet: protein >= goal
      };
    });
  }, [summaryData, weekAgo, today, goal]);

  const avgProtein = useMemo(() => {
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum, day) => sum + day.protein, 0);
    return Math.round(total / 7);
  }, [chartData]);

  const daysMet = chartData.filter(d => d.isMet).length;

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Insights</h1>
          <p className="text-muted-foreground">Your performance over the last 7 days.</p>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Weekly Average</p>
              <p className="text-3xl font-bold tracking-tighter text-foreground" data-testid="text-avg-protein">
                {avgProtein}g <span className="text-base font-normal text-muted-foreground">/ day</span>
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Goal Met</p>
              <p className="text-3xl font-bold tracking-tighter text-foreground" data-testid="text-days-met">
                {daysMet} <span className="text-base font-normal text-muted-foreground">/ 7 days</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Protein Intake (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-8 pl-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`${value}g`, "Protein"]}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  />
                  <ReferenceLine y={goal} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ position: 'top', value: 'Goal', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Bar dataKey="protein" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isMet ? "hsl(var(--primary))" : "hsl(var(--secondary-foreground) / 0.5)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
