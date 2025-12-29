import { SavedPostsProvider } from "@/components/SavedPostsProvider";
import RecipeClient from "../../../components/recipe/RecipeClient";

export default function RecipePage() {
  return (
    <SavedPostsProvider>
      <RecipeClient />
    </SavedPostsProvider>
  );
}
