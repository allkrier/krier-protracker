export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  protein_goal: number;
  created_at: string;
  updated_at: string;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  food_name: string;
  brand: string | null;
  serving_size: number;
  serving_unit: string;
  protein_per_serving: number;
  calories_per_serving: number | null;
  logged_at: string;
  created_at: string;
}

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  brands: string;
  nutriments: {
    proteins_100g?: number;
    energy_kcal_100g?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
}

export interface DailySummary {
  date: string;
  total_protein: number;
  entry_count: number;
}

export interface WeeklySummary {
  date: string;
  total_protein: number;
  goal: number;
}
