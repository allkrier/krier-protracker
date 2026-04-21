import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { searchFoods } from "@/services/openFoodFacts";
import { OpenFoodFactsProduct } from "@/types";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const manualEntrySchema = z.object({
  food_name: z.string().min(2, "Name is required"),
  brand: z.string().optional(),
  serving_size: z.coerce.number().min(0.1, "Required"),
  serving_unit: z.string().min(1, "Required"),
  protein_per_serving: z.coerce.number().min(0, "Required"),
  calories_per_serving: z.coerce.number().optional(),
});

export default function LogFoodPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [, setLocation] = useLocation();
  const { addEntry } = useFoodEntries(today);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OpenFoodFactsProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OpenFoodFactsProduct | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const results = await searchFoods(searchQuery);
          setSearchResults(results);
        } catch (error) {
          toast({ title: "Search failed", variant: "destructive" });
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, toast]);

  const form = useForm<z.infer<typeof manualEntrySchema>>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      food_name: "",
      brand: "",
      serving_size: 100,
      serving_unit: "g",
      protein_per_serving: 0,
      calories_per_serving: undefined,
    },
  });

  const handleSelectProduct = (product: OpenFoodFactsProduct) => {
    setSelectedProduct(product);
    const servingSize = product.serving_quantity || 100;
    const protein100g = product.nutriments?.proteins_100g || 0;
    const proteinPerServing = (protein100g / 100) * servingSize;
    const calories100g = product.nutriments?.energy_kcal_100g || 0;
    const caloriesPerServing = (calories100g / 100) * servingSize;

    form.reset({
      food_name: product.product_name,
      brand: product.brands || "",
      serving_size: servingSize,
      serving_unit: "g",
      protein_per_serving: Number(proteinPerServing.toFixed(1)),
      calories_per_serving: caloriesPerServing ? Number(caloriesPerServing.toFixed(0)) : undefined,
    });
  };

  const onSubmit = async (values: z.infer<typeof manualEntrySchema>) => {
    try {
      await addEntry.mutateAsync({
        date: today,
        food_name: values.food_name,
        brand: values.brand || null,
        serving_size: values.serving_size,
        serving_unit: values.serving_unit,
        protein_per_serving: values.protein_per_serving,
        calories_per_serving: values.calories_per_serving || null,
      });
      toast({ title: "Food logged successfully" });
      setLocation("/");
    } catch (error: any) {
      toast({ title: "Failed to log food", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Log Food</h1>
          <p className="text-muted-foreground">Add what you've eaten today.</p>
        </header>

        {selectedProduct ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <Button variant="ghost" onClick={() => setSelectedProduct(null)} className="mb-4 -ml-4" data-testid="button-back-to-search">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to search
            </Button>

            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="food_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-food-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serving_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serving Size</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" {...field} data-testid="input-serving-size" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="serving_unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-serving-unit" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="protein_per_serving"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" {...field} data-testid="input-protein" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full mt-4" disabled={addEntry.isPending} data-testid="button-submit-log">
                      {addEntry.isPending ? "Saving..." : "Log Entry"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  className="pl-10 h-12 text-lg rounded-xl bg-card border-border"
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-food"
                />
              </div>

              {isSearching && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((product) => {
                    const protein100g = product.nutriments?.proteins_100g || 0;
                    return (
                      <button
                        key={product.code}
                        onClick={() => handleSelectProduct(product)}
                        className="w-full text-left p-4 bg-card border border-border rounded-xl hover:bg-secondary/50 transition-colors flex justify-between items-center"
                        data-testid={`button-select-${product.code}`}
                      >
                        <div className="min-w-0 pr-4">
                          <h3 className="font-medium text-foreground truncate">{product.product_name}</h3>
                          {product.brands && <p className="text-sm text-muted-foreground truncate">{product.brands}</p>}
                        </div>
                        <div className="whitespace-nowrap text-right">
                          <span className="font-bold text-primary">{Math.round(protein100g)}g</span>
                          <span className="text-xs text-muted-foreground block">per 100g</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {!isSearching && searchQuery.length > 2 && searchResults.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
                  No foods found matching "{searchQuery}".
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual">
              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="food_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Chicken Breast" {...field} data-testid="input-manual-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="serving_size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Serving Size</FormLabel>
                              <FormControl>
                                <Input type="number" step="any" {...field} data-testid="input-manual-size" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="serving_unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <FormControl>
                                <Input placeholder="g, oz, piece" {...field} data-testid="input-manual-unit" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="protein_per_serving"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Protein (g)</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" {...field} data-testid="input-manual-protein" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full mt-4" disabled={addEntry.isPending} data-testid="button-submit-manual">
                        {addEntry.isPending ? "Saving..." : "Log Entry"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
