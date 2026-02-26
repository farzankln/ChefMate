import { Recipe, RecipeNutrient } from "@/types/recipe";
import { FiActivity } from "react-icons/fi";

interface RecipeNutritionProps {
  recipe: Recipe;
}

export default function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const nutrients: RecipeNutrient[] =
    recipe.originalRecipe?.nutrition?.nutrients || [];

  if (!nutrients.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <FiActivity className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Nutrition Data Available
        </h3>
        <p className="text-gray-500 mb-4">
          This recipe doesn&apos;t have nutritional information available.
        </p>
        <p className="text-sm text-gray-400">
          Nutrition data is not available for this recipe. You can still enjoy
          cooking!
        </p>
      </div>
    );
  }

  // Show only key nutrients
  const keyNutrients = [
    "Calories",
    "Fat",
    "Carbohydrates",
    "Protein",
    "Fiber",
    "Sugar",
    "Sodium",
  ];

  const displayedNutrients = nutrients
    .filter((nutrient) => keyNutrients.includes(nutrient.name))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Nutrition Facts</h3>
        <span className="text-sm text-gray-500">
          {displayedNutrients.length} nutrients
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {displayedNutrients.map((n: RecipeNutrient, i: number) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{n.name}</span>
              <span className="font-bold text-red-600">
                {Math.round(n.amount)} {n.unit}
              </span>
            </div>

            {n.percentOfDailyNeeds && (
              <div className="space-y-1">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden relative">
                  <div
                    className="nutrition-bar bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(n.percentOfDailyNeeds, 100)}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(n.percentOfDailyNeeds)}% of daily needs
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          <strong>Note:</strong> Nutrition values are approximate and may vary
          based on ingredients and preparation methods.
        </p>
      </div>
    </div>
  );
}
