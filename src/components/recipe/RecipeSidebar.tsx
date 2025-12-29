import SimilarRecipes from "./SimilarRecipes";
import { Recipe, SimilarRecipe } from "@/types/recipe";

interface RecipeSidebarProps {
  recipe: Recipe;
  similarRecipes: SimilarRecipe[];
}

export default function RecipeSidebar({
  recipe,
  similarRecipes,
}: RecipeSidebarProps) {
  return (
    <aside className="space-y-8">
      {recipe.author && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Author</h3>
          <p>{recipe.author}</p>
        </div>
      )}

      <SimilarRecipes recipes={similarRecipes} />
    </aside>
  );
}
