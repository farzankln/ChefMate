"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import type { SavedPost } from "@/types/context";

interface SaveRecipeButtonProps {
  recipe: {
    id: string;
    title?: string;
    [key: string]: unknown;
  };
}

export default function SaveRecipeButton({ recipe }: SaveRecipeButtonProps) {
  const { data: session } = useSession();
  const { savedPosts, mutate } = useSavedPostsContext();

  const isSaved =
    Array.isArray(savedPosts) &&
    savedPosts.some((p: SavedPost) => p.postId === recipe.id);

  const toggleSave = async () => {
    if (!session) {
      toast.error("Please log in to save recipes");
      return;
    }

    // Validate required recipe properties
    if (!recipe?.id) {
      toast.error("Invalid recipe data");
      return;
    }

    // Ensure user ID exists
    const userId = session.user?.id;
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      if (isSaved) {
        mutate(
          (curr: SavedPost[]) => curr.filter((p) => p.postId !== recipe.id),
          { revalidate: false }
        );

        const response = await fetch(`/api/saved-posts/${recipe.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success("Removed from saved recipes");
      } else {
        mutate(
          (curr: SavedPost[]) => [
            {
              id: `temp-${Date.now()}`,
              userId: userId,
              postId: recipe.id,
              createdAt: new Date(),
              post: recipe,
            },
            ...(curr || []),
          ],
          { revalidate: false }
        );

        const response = await fetch("/api/saved-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: recipe.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success("Recipe saved");
      }

      mutate();
    } catch (error) {
      console.error("Save recipe error:", error);
      toast.error("Something went wrong. Please try again.");
      mutate();
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        isSaved ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
