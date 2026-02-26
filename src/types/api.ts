// API and External Service Types

// Spoonacular API Types
export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  pricePerServing: number;
  aggregatedLikes: number;
  healthScore: number;
  spoonacularScore: number;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  winePairing: {
    pairedWines: string[];
    pairingText: string;
    productMatches: unknown[];
  };
  instructions: unknown[];
  analyzedInstructions: unknown[];
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }>;
  };
  tips: {
    property: string;
    value: string;
  };
  difficulty: string;
  tags: string[];
}

export interface SpoonacularSearchResult {
  id: number;
  title: string;
  image: string;
  imageType?: string;
}

export interface ComplexSearchParams {
  type?: string;
  number?: number;
  offset?: number;
}

export interface RecipeInfoParams {
  ids: string;
  includeNutrition?: boolean;
}

export interface SpoonacularComplexSearchResponse {
  results: SpoonacularSearchResult[];
  totalResults: number;
}

export interface SpoonacularSimilarRecipe {
  id: number;
  title: string;
}

export interface SpoonacularRandomRecipeResponse {
  recipes: SpoonacularRecipe[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
