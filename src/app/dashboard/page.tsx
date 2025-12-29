import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContentCard } from "@/components/content-card";
import { SavedPostsProvider } from "@/components/SavedPostsProvider";

interface SavedPostData {
  id: string;
  postId: string;
  createdAt: Date;
  source: string; // "internal" | "spoonacular"
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  imageUrl: string | null;
  author: string | null;
  category: string | null;
  prepTime: string | null;
  cookTime: string | null;
  servings: string | null;
  difficulty: string | null;
  tags: string[];
  likes: number;
}

// تبدیل snapshot ذخیره‌شده به فرمت ContentCard
function transformSavedPost(savedPost: SavedPostData) {
  return {
    id: savedPost.postId,
    title: savedPost.title || "Untitled Recipe",
    description: savedPost.description || "No description available",
    thumbnail: savedPost.thumbnail || undefined,
    imageUrl: savedPost.imageUrl || undefined,
    author: savedPost.author || "Unknown Author",
    category: savedPost.category || "Miscellaneous",
    prepTime: savedPost.prepTime || undefined,
    cookTime: savedPost.cookTime || undefined,
    servings: savedPost.servings || undefined,
    difficulty: savedPost.difficulty || undefined,
    tags: savedPost.tags || [],
    views: 0,
    likes: savedPost.likes || 0,
    createdAt: savedPost.createdAt,
    updatedAt: savedPost.createdAt,
  };
}

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
    // گرفتن همه پست‌های ذخیره‌شده با snapshot
    savedPosts = await prisma.savedPost.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }) as SavedPostData[];

    console.log("Found saved posts:", savedPosts.length);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    savedPosts = [];
  }

  return (
    <SavedPostsProvider>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user.name || session.user.email}!
            </h1>
            <p className="text-gray-600">Here are your saved recipes.</p>
          </div>

          {/* Saved Recipes */}
          {savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No saved recipes yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start saving recipes to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedPosts.map((savedPost) => {
                const post = transformSavedPost(savedPost);
                return <ContentCard key={savedPost.id} post={post} />;
              })}
            </div>
          )}
        </div>
      </div>
    </SavedPostsProvider>
  );
}
