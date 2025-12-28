import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";

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

  // Debug: Log the session user ID to see what we're getting
  console.log(
    "Session user ID:",
    session.user.id,
    "Type:",
    typeof session.user.id,
    "Length:",
    session.user.id?.length
  );

  let savedPosts: Array<{
    id: string;
    postId: string;
    createdAt: Date;
    post: Post | null;
  }> = [];
  try {
    // First get saved post IDs for this user
    const savedPostRecords = await prisma.savedPost.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        postId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Found saved post records:", savedPostRecords?.length || 0);

    // Separate internal posts (valid ObjectIDs) from external recipe IDs
    const internalPostIds = savedPostRecords
      .filter((sp) => sp.postId.length === 24) // Valid ObjectID length
      .map((sp) => sp.postId);

    const externalRecipeIds = savedPostRecords
      .filter((sp) => sp.postId.length !== 24) // External recipe IDs
      .map((sp) => sp.postId);

    console.log("Internal posts:", internalPostIds.length);
    console.log("External recipes:", externalRecipeIds.length);

    // Fetch internal posts separately
    let internalPosts: Post[] = [];
    if (internalPostIds.length > 0) {
      internalPosts = await prisma.post.findMany({
        where: {
          id: {
            in: internalPostIds,
          },
        },
      });
    }

    // Combine results
    savedPosts = savedPostRecords.map((record) => ({
      ...record,
      post: internalPosts.find((p) => p.id === record.postId) || null,
    }));

    console.log("Final saved posts:", savedPosts?.length || 0);
  } catch (error) {
    console.error("Error querying saved posts:", error);
    savedPosts = [];
  }

  return (
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
            {savedPosts.map(({ post, postId }) => {
              // Handle both internal posts (with post data) and external recipes (post is null)
              if (!post) {
                // For external recipes, we'll show a placeholder or fetch data
                return (
                  <div
                    key={postId}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        External Recipe
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Recipe ID: {postId}
                      </p>
                      <p className="text-xs text-gray-500">
                        This recipe is from an external source.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title || "Untitled Recipe"}
                    </h3>
                    {post.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {post.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.category && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {post.category}
                        </span>
                      )}
                      {post.difficulty && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {post.difficulty}
                        </span>
                      )}
                    </div>
                    {post.author && (
                      <p className="text-xs text-gray-500">By {post.author}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
