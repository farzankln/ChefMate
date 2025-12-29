import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmptySavedRecipes from "@/components/dashboard/EmptySavedRecipes";
import SavedRecipesList from "@/components/dashboard/SavedRecipesList";
import { SavedPostData } from "@/components/dashboard/transformSavedPost";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in
          </h1>
          <p className="text-gray-600">
            You need to be logged in to view your saved recipes.
          </p>
        </div>
      </div>
    );
  }

  let savedPosts: SavedPostData[] = [];

  try {
    const rawSavedPosts = await prisma.savedPost.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Transform raw database results to match SavedPostData interface
    savedPosts = rawSavedPosts.map((post) => ({
      id: post.id,
      postId: post.postId,
      createdAt: post.createdAt,
      source: post.source || "unknown", // Provide fallback for null source
      title: post.title,
      description: post.description,
      thumbnail: post.thumbnail,
      imageUrl: post.imageUrl,
      author: post.author,
      category: post.category,
      prepTime: post.prepTime,
      cookTime: post.cookTime,
      servings: post.servings,
      difficulty: post.difficulty,
      tags: post.tags || [],
      likes: post.likes,
    }));
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    savedPosts = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          userName={session.user.name || session.user.email || "User"}
          userImage={session.user.image || null}
        />
        {savedPosts.length === 0 ? (
          <EmptySavedRecipes />
        ) : (
          <SavedRecipesList savedPosts={savedPosts} />
        )}
      </div>
    </div>
  );
}
