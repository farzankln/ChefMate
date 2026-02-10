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
      <SimilarRecipes recipes={similarRecipes} />
    </aside>
  );
}
