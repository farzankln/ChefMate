// Recipe types re-exported from api.ts as the single source of truth.
// Spoonacular API types and recipe data structures are centralized in api.ts
// to maintain consistency across the application.
export type {
  SpoonacularRecipe,
  RecipeIngredient,
  RecipeStep,
  RecipeInstruction,
} from "./api";

export interface RecipeNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface RecipeNutrition {
  nutrients: RecipeNutrient[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  imageUrl: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  tags: string[];
  createdAt: Date;
  originalRecipe?: import("./api").SpoonacularRecipe;
}

export interface SimilarRecipe {
  id: string;
  title: string;
  imageUrl: string;
}

export interface UseRecipeDetailReturn {
  recipe: Recipe | null;
  similarRecipes: SimilarRecipe[];
  loading: boolean;
  error: string | null;
  setSavingState: (saving: boolean) => void;
}
