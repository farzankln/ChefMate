// API and External Service Types

// Recipe instruction types (used by SpoonacularRecipe)
export interface RecipeStep {
  number: number;
  step: string;
  ingredients?: Array<{ name: string }>;
  equipment?: Array<{ name: string }>;
}

export interface RecipeInstruction {
  name: string;
  steps: RecipeStep[];
}

export interface RecipeIngredient {
  amount: number;
  unit: string;
  name: string;
}

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
  winePairing?: {
    pairedWines: string[];
    pairingText: string;
    productMatches: unknown[];
  };
  tips?: {
    property: string;
    value: string;
  };
  instructions: unknown[];
  analyzedInstructions: RecipeInstruction[];
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }>;
  };
  difficulty: string;
  tags: string[];
  extendedIngredients: RecipeIngredient[];
}

export interface SpoonacularSearchResult {
  id: number;
  title: string;
  image: string;
  imageType?: string;
}

export interface ComplexSearchParams {
  query?: string;
  type?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  number?: number;
  offset?: number;
  addRecipeInformation?: boolean;
  fillIngredients?: boolean;
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
