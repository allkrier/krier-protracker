import { OpenFoodFactsProduct } from "@/types";

export async function searchFoods(query: string): Promise<OpenFoodFactsProduct[]> {
  if (!query) return [];
  
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&fields=code,product_name,brands,nutriments,serving_size,serving_quantity&page_size=10`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to search foods");
  }
  
  const data = await response.json();
  return data.products || [];
}
