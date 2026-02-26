import { Recipe, RecipeIngredient } from "@/types/recipe";
import { FiCheckSquare } from "react-icons/fi";

interface RecipeIngredientsProps {
  recipe: Recipe;
}

export default function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
  const ingredients: RecipeIngredient[] =
    recipe.originalRecipe?.extendedIngredients || [];

  if (!ingredients.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <FiCheckSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Ingredients Available
        </h3>
        <p className="text-gray-500 mb-4">
          This recipe doesn&apos;t have detailed ingredients information
          available.
        </p>
        <p className="text-sm text-gray-400">
          Try searching for similar recipes or check the original source for
          complete ingredient lists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
        <span className="text-sm text-gray-500">
          {ingredients.length} item{ingredients.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="space-y-3">
        {ingredients.map((ing: RecipeIngredient, i: number) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-gray-900">
                {ing.amount} {ing.unit}
              </span>
              <span className="text-gray-700 ml-1">{ing.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
