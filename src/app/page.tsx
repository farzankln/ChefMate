"use client";

import { useState, useEffect } from "react";
import { ContentCard } from "@/components/content-card";
import { getFeaturedRecipes } from "@/lib/spoonacular";
import { FiAlertCircle, FiFileText } from "react-icons/fi";
import { CardSkeleton } from "@/components/skeletons";
import type { Post } from "@/types/components";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-dvh  bg-gray-50">
      {/* Hero Section */}
      <section className="h-dvh bg-gradient-to-br from-red-600 via-red-800 to-red-950 text-white flex flex-col justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            From quick weeknight dinners to elaborate weekend feasts, find your
            next culinary adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-red-950/50 bg-opacity-20 rounded-lg px-6 py-3">
              <span className="text-sm font-medium">1,000+ Recipes</span>
            </div>
            <div className="bg-red-950/50 bg-opacity-20 rounded-lg px-6 py-3">
              <span className="text-sm font-medium">Easy to Follow</span>
            </div>
            <div className="bg-red-950/50 bg-opacity-20 rounded-lg px-6 py-3">
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
            Discover delicious recipes from around the world.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <FiAlertCircle
                className="w-5 h-5 text-red-600 mr-2"
                aria-hidden="true"
              />
              <span className="text-red-700">
                Error loading recipes: {error}
              </span>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <ContentCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
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
