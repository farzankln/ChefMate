"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { CardSkeleton } from "@/components/skeletons";
import { FiSearch, FiAlertCircle, FiX } from "react-icons/fi";
import type { Post } from "@/types/components";

// Search filter options
const MEAL_TYPES = [
  { value: "", label: "All Types" },
  { value: "main course", label: "Main Course" },
  { value: "side dish", label: "Side Dish" },
  { value: "dessert", label: "Dessert" },
  { value: "appetizer", label: "Appetizer" },
  { value: "salad", label: "Salad" },
  { value: "soup", label: "Soup" },
  { value: "snack", label: "Snack" },
  { value: "drink", label: "Drink" },
];

const DIETS = [
  { value: "", label: "All Diets" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten free", label: "Gluten Free" },
  { value: "ketogenic", label: "Ketogenic" },
  { value: "paleo", label: "Paleo" },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "";
  const initialDiet = searchParams.get("diet") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [mealType, setMealType] = useState(initialType);
  const [diet, setDiet] = useState(initialDiet);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (mealType) params.set("type", mealType);
      if (diet) params.set("diet", diet);

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setPosts(data.recipes || []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Failed to search recipes");
      setPosts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, mealType, diet]);

  // Initial search on page load
  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Update URL with search params
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (mealType) params.set("type", mealType);
    if (diet) params.set("diet", diet);

    router.push(`/search?${params.toString()}`);
    setSearchQuery(query);
  };

  const handleFilterChange = () => {
    // Trigger search when filters change if we have a query
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (mealType) params.set("type", mealType);
      if (diet) params.set("diet", diet);

      router.push(`/search?${params.toString()}`);
      performSearch();
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [mealType, diet]);

  const clearSearch = () => {
    setQuery("");
    setSearchQuery("");
    setPosts([]);
    setTotalResults(0);
    setHasSearched(false);
    router.push("/search");
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Recipes
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <label
                htmlFor="mealType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meal Type
              </label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              >
                {MEAL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-48">
              <label
                htmlFor="diet"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diet
              </label>
              <select
                id="diet"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              >
                {DIETS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        {hasSearched && !loading && (
          <div className="mb-6">
            <p className="text-lg text-gray-700">
              {totalResults > 0
                ? `Found ${totalResults} recipe${totalResults === 1 ? "" : "s"} for "${searchQuery}"`
                : `No recipes found for "${searchQuery}"`}
            </p>
          </div>
        )}

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
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State - Initial */}
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Search for recipes
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Enter a search term to find recipes, or browse by meal type and
              diet.
            </p>
          </div>
        )}

        {/* Empty State - No Results */}
        {!loading && hasSearched && posts.length === 0 && !error && (
          <div className="text-center py-16">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No recipes found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
