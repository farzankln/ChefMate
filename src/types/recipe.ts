export interface RecipeIngredient {
  amount: number;
  unit: string;
  name: string;
}

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

export interface RecipeNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface RecipeNutrition {
  nutrients: RecipeNutrient[];
}

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
  instructions: unknown[];
  analyzedInstructions: RecipeInstruction[];
  nutrition: RecipeNutrition;
  difficulty: string;
  tags: string[];
  extendedIngredients: RecipeIngredient[];
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
  originalRecipe?: SpoonacularRecipe;
  [key: string]: unknown;
}

export interface SimilarRecipe {
  id: string;
  title: string;
  imageUrl: string;
  [key: string]: unknown;
}

export interface UseRecipeDetailReturn {
  recipe: Recipe | null;
  similarRecipes: SimilarRecipe[];
  loading: boolean;
  error: string | null;
  setSavingState: (saving: boolean) => void;
}
