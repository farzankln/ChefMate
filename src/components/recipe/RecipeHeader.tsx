import { Recipe } from "@/types/recipe";
import { SaveButton } from "../ui/SaveButton";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { Badge } from "../ui/Badge";
import { RecipeMetadata } from "../ui/RecipeMetadata";
import { Tags } from "../ui/Tags";

interface RecipeHeaderProps {
  recipe: Recipe;
  setSavingState?: (saving: boolean) => void;
}

export default function RecipeHeader({
  recipe,
  setSavingState,
}: RecipeHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Hero Image */}
      {recipe.imageUrl && (
        <div className="relative h-96 overflow-hidden">
          <ImageWithFallback
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-liner-to-t from-black/50 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {recipe.category && (
              <Badge variant="category" size="md">
                {recipe.category}
              </Badge>
            )}
            {recipe.difficulty && (
              <Badge variant="difficulty" size="md">
                {recipe.difficulty}
              </Badge>
            )}
          </div>

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 m-4 text-white bg-white rounded-2xl">
            <RecipeMetadata
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              servings={recipe.servings}
              showIcons={false}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {recipe.title}
            </h1>

            {recipe.description && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {recipe.description}
              </p>
            )}
          </div>

          <div className="lg:shrink-0">
            <SaveButton
              recipe={recipe}
              variant="button"
              size="lg"
              className="shadow-lg"
              setSavingState={setSavingState}
            />
          </div>
        </div>

        {/* Tags */}
        <Tags tags={recipe.tags || []} maxDisplay={6} />
      </div>
    </div>
  );
}
