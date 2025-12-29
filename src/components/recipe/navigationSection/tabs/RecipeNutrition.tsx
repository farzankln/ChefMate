import { Recipe, RecipeNutrient } from "@/types/recipe";

interface RecipeNutritionProps {
  recipe: Recipe;
}

export default function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const nutrients: RecipeNutrient[] =
    recipe.originalRecipe?.nutrition?.nutrients || [];

  if (!nutrients.length) {
    return <p className="text-gray-600">No nutrition data.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {nutrients.slice(0, 6).map((n: RecipeNutrient, i: number) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-1">
            <span>{n.name}</span>
            <span className="font-semibold">
              {Math.round(n.amount)} {n.unit}
            </span>
          </div>

          {n.percentOfDailyNeeds && (
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="nutrition-bar bg-blue-600 h-2 rounded-full"
                style={
                  {
                    "--percent": `${Math.min(n.percentOfDailyNeeds, 100)}%`,
                  } as React.CSSProperties
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
