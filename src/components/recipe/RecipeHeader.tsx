import Image from "next/image";
import SaveRecipeButton from "../SaveRecipeButton";
import { Recipe } from "@/types/recipe";

interface RecipeHeaderProps {
  recipe: Recipe;
}

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {recipe.imageUrl && (
        <div className="relative h-80">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <SaveRecipeButton recipe={recipe} />
        </div>

        <p className="text-gray-600">{recipe.description}</p>
      </div>
    </div>
  );
}
