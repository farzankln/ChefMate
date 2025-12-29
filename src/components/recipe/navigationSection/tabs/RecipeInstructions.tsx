import { Recipe, RecipeStep } from "@/types/recipe";

interface RecipeInstructionsProps {
  recipe: Recipe;
}

export default function RecipeInstructions({
  recipe,
}: RecipeInstructionsProps) {
  const instructions: RecipeStep[] =
    recipe.originalRecipe?.analyzedInstructions?.flatMap((i) => i.steps) || [];

  if (!instructions.length) {
    return <p className="text-gray-600">No instructions available.</p>;
  }

  return (
    <ol className="space-y-6">
      {instructions.map((step: RecipeStep) => (
        <li key={step.number} className="flex gap-4">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            {step.number}
          </span>
          <p className="text-gray-700">{step.step}</p>
        </li>
      ))}
    </ol>
  );
}
