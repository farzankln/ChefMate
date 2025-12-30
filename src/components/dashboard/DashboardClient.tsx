"use client";

import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import DashboardHeader from "./DashboardHeader";
import EmptySavedRecipes from "./EmptySavedRecipes";
import SavedRecipesList from "./SavedRecipesList";
import {
  DashboardHeaderSkeleton,
  SavedRecipesGridSkeleton,
} from "@/components/skeletons";

export function DashboardClient({
  userName,
  userImage,
}: {
  userName: string;
  userImage: string | null;
}) {
  const { savedPosts, isLoading } = useSavedPostsContext();

  // Ensure savedPosts is always an array
  const safeSavedPosts = Array.isArray(savedPosts) ? savedPosts : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-liner-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeaderSkeleton />
          <SavedRecipesGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-liner-to-br from-gray-50 via-white to-blue-50/30 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader userName={userName} userImage={userImage} />
        {safeSavedPosts.length === 0 ? (
          <EmptySavedRecipes />
        ) : (
          <SavedRecipesList
            savedPosts={safeSavedPosts.map((savedPost) => ({
              id: savedPost.postId,
              postId: savedPost.postId,
              createdAt: savedPost.createdAt,
              source: "unknown",
              title: savedPost.post?.title || null,
              description: savedPost.post?.description || null,
              thumbnail: savedPost.post?.thumbnail || null,
              imageUrl: savedPost.post?.imageUrl || null,
              author: savedPost.post?.author || null,
              category: savedPost.post?.category || null,
              prepTime: savedPost.post?.prepTime || null,
              cookTime: savedPost.post?.cookTime || null,
              servings: savedPost.post?.servings || null,
              difficulty: savedPost.post?.difficulty || null,
              tags: savedPost.post?.tags || [],
              ingredients: savedPost.ingredients,
              instructions: savedPost.instructions,
              nutrition: savedPost.nutrition,
            }))}
          />
        )}
      </div>
    </div>
  );
}
