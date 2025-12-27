"use client";

import { useState, useEffect } from "react";
import ContentCard from "@/components/content-card";
import { useSession } from "next-auth/react";
import { getFeaturedRecipes } from "@/lib/spoonacular";

interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);
        const recipes = await getFeaturedRecipes();
        setPosts(recipes);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err instanceof Error ? err.message : "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleLikeToggle = (postId: string, isLiked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: isLiked ? post.likes + 1 : post.likes - 1 }
          : post
      )
    );
  };

  const handleViewIncrement = async (postId: string) => {
    try {
      const response = await fetch("/api/posts/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, views: post.views + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            From quick weeknight dinners to elaborate weekend feasts, find your
            next culinary adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
              <span className="text-sm font-medium">1,000+ Recipes</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
              <span className="text-sm font-medium">Easy to Follow</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
              <span className="text-sm font-medium">Community Favorites</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Recipes
          </h2>
          <p className="text-lg text-gray-600">
            Discover delicious recipes from around the world. Like and save your
            favorites!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading recipes...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700">
                Error loading recipes: {error}
              </span>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <ContentCard
              key={post.id}
              post={post}
              onLikeToggle={handleLikeToggle}
              onViewIncrement={handleViewIncrement}
              isLocked={session ? false : false} // Will be implemented with locks API
            />
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No recipes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first recipe.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
