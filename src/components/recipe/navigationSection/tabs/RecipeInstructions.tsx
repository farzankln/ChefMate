import { Recipe, RecipeStep } from "@/types/recipe";
import { FiList } from "react-icons/fi";

interface RecipeInstructionsProps {
  recipe: Recipe;
}

export default function RecipeInstructions({
  recipe,
}: RecipeInstructionsProps) {
  const instructions: RecipeStep[] =
    recipe.originalRecipe?.analyzedInstructions?.flatMap((i) => i.steps) || [];

  if (!instructions.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <FiList className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Instructions Available
        </h3>
        <p className="text-gray-500 mb-4">
          This recipe doesn&apos;t have step-by-step instructions available.
        </p>
        <p className="text-sm text-gray-400">
          Check the original source or try searching for similar recipes with
          complete instructions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Instructions</h3>
        <span className="text-sm text-gray-500">
          {instructions.length} step{instructions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ol className="space-y-6">
        {instructions.map((step: RecipeStep) => (
          <li key={step.number} className="flex">
            <span className="w-8 h-8 bg-red-600 text-white rounded-l-full flex items-center justify-center font-semibold text-sm shrink-0">
              {step.number}
            </span>
            <div className="flex-1 bg-gray-100 rounded-lg rounded-tl-none p-4">
              <p className="text-gray-700 leading-relaxed">{step.step}</p>

              {step.ingredients && step.ingredients.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Ingredients needed:
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.ingredients.map((ing) => ing.name).join(", ")}
                  </p>
                </div>
              )}

              {step.equipment && step.equipment.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Equipment:
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.equipment.map((eq) => eq.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
