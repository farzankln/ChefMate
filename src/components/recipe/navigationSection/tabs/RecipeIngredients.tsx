import { Recipe, RecipeIngredient } from "@/types/recipe";

interface RecipeIngredientsProps {
  recipe: Recipe;
}

export default function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
  const ingredients: RecipeIngredient[] =
    recipe.originalRecipe?.extendedIngredients || [];

  if (!ingredients.length) {
    return <p className="text-gray-600">No ingredients listed.</p>;
  }

  return (
    <ul className="space-y-3">
      {ingredients.map((ing: RecipeIngredient, i: number) => (
        <li key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-600 rounded-full" />
          {ing.amount} {ing.unit} {ing.name}
        </li>
      ))}
    </ul>
  );
}
