"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useSavedPostsContext,
  SavedPost,
  SavedPostsProvider,
} from "@/components/SavedPostsProvider";
import toast from "react-hot-toast";
import { getRecipeById, getSimilarRecipes } from "@/lib/spoonacular";

interface NutritionNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

interface Nutrition {
  nutrients: NutritionNutrient[];
}

interface ExtendedIngredient {
  amount: number;
  unit: string;
  name: string;
}

interface AnalyzedInstruction {
  steps: Array<{
    number: number;
    step: string;
    ingredients: Array<{ name: string }>;
    equipment: Array<{ name: string }>;
  }>;
}

interface SpoonacularRecipeData {
  analyzedInstructions: AnalyzedInstruction[];
  nutrition: Nutrition;
  extendedIngredients: ExtendedIngredient[];
}

interface RecipeDetail {
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
  likes: number;
  createdAt: string | Date;
  originalRecipe?: SpoonacularRecipeData;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { savedPosts, mutate } = useSavedPostsContext();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<RecipeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "instructions" | "nutrition" | "ingredients"
  >("instructions");

  useEffect(() => {
    async function fetchRecipeDetails() {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);

        const recipeId = params.id as string;

        const snapshot = savedPosts?.find(
          (item: SavedPost) => item.postId === recipeId
        )?.post;

        if (snapshot) {
          // Transform snapshot to match RecipeDetail interface
          const transformedSnapshot: RecipeDetail = {
            id: snapshot.id,
            title: snapshot.title || "Untitled Recipe",
            description: snapshot.description || "No description available",
            thumbnail: snapshot.thumbnail,
            imageUrl: snapshot.imageUrl,
            author: snapshot.author,
            category: snapshot.category,
            prepTime: snapshot.prepTime,
            cookTime: snapshot.cookTime,
            servings: snapshot.servings,
            difficulty: snapshot.difficulty,
            tags: snapshot.tags || [],
            likes: snapshot.likes || 0,
            createdAt: snapshot.createdAt || new Date(),
            originalRecipe: undefined, // Snapshot doesn't contain original recipe data
          };

          setRecipe(transformedSnapshot);
          setLoading(false);
          return; 
        }

        const [recipeData, similarData] = await Promise.all([
          getRecipeById(recipeId),
          getSimilarRecipes(parseInt(recipeId), 4),
        ]);

        setRecipe(recipeData);
        setSimilarRecipes(similarData);
      } catch (err) {
        console.error("Error fetching recipe details:", err);

        setError(
          err instanceof Error ? err.message : "Failed to load recipe details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecipeDetails();
  }, [params.id, savedPosts]);

  // Check if current recipe is saved by user
  const isSaved =
    Array.isArray(savedPosts) &&
    savedPosts.some((item: SavedPost) => item.postId === params.id);

  const toggleSave = async () => {
    if (!session) {
      toast.error("Please log in to save recipes");
      return;
    }

    setSaving(true);

    try {
      if (isSaved) {
        // Optimistic update - remove from saved posts
        mutate(
          (current: SavedPost[]) =>
            Array.isArray(current)
              ? current.filter((item) => item.postId !== params.id)
              : [],
          { revalidate: false }
        );

        // Make API call to remove from saved posts
        const response = await fetch(`/api/saved-posts/${params.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          // Revert optimistic update if API call fails
          mutate(undefined, { revalidate: true });
          throw new Error("Failed to remove from saved recipes");
        }

        toast.success("Removed from saved recipes");
      } else {
        // Optimistic update - add to saved posts
        const newSavedPost: SavedPost = {
          id: `temp-${Date.now()}`,
          userId: session.user.id,
          postId: params.id as string,
          createdAt: new Date(),
          post: recipe
            ? {
                ...recipe,
                createdAt: recipe.createdAt
                  ? new Date(recipe.createdAt)
                  : undefined,
              }
            : null,
        };
        mutate(
          (current: SavedPost[]) => [
            newSavedPost,
            ...(Array.isArray(current) ? current : []),
          ],
          { revalidate: false }
        );

        // Make API call to save post
        const response = await fetch("/api/saved-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: params.id }),
        });

        if (!response.ok) {
          // Revert optimistic update if API call fails
          mutate(undefined, { revalidate: true });
          throw new Error("Failed to save recipe");
        }

        toast.success("Recipe saved");
      }

      // Revalidate data from backend
      mutate(undefined, { revalidate: true });
    } catch (error) {
      console.error("Save toggle error:", error);
      toast.error("Something went wrong. Please try again.");
      // Revalidate to sync with backend state
      mutate(undefined, { revalidate: true });
    } finally {
      setSaving(false);
    }
  };

  const formatInstructions = (instructions: AnalyzedInstruction[]) => {
    if (!instructions || instructions.length === 0) return [];

    return instructions.flatMap((instruction) => {
      if (instruction.steps && Array.isArray(instruction.steps)) {
        return instruction.steps.map((step, index: number) => ({
          number: step.number || index + 1,
          step: step.step || "",
          ingredients: step.ingredients || [],
          equipment: step.equipment || [],
        }));
      }
      return [];
    });
  };

  const getNutritionInfo = (nutrition: Nutrition | undefined) => {
    if (!nutrition || !nutrition.nutrients) return [];

    const importantNutrients = [
      "Calories",
      "Fat",
      "Carbohydrates",
      "Protein",
      "Fiber",
      "Sugar",
      "Sodium",
    ];

    return nutrition.nutrients.filter((nutrient: NutritionNutrient) =>
      importantNutrients.includes(nutrient.name)
    );
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg
              className="w-12 h-12 text-red-600 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Recipe Not Found
            </h2>
            <p className="text-red-700 mb-4">
              {error || "The recipe you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const instructions = formatInstructions(
    recipe.originalRecipe?.analyzedInstructions || []
  );
  const nutritionInfo = getNutritionInfo(recipe.originalRecipe?.nutrition);
  const ingredients = recipe.originalRecipe?.extendedIngredients || [];

  return (
    <SavedPostsProvider>
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">{recipe.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Recipe Header */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="relative h-64 md:h-96">
                  {recipe.imageUrl && (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
                    />
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {recipe.category && (
                      <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                        {recipe.category}
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(
                          recipe.difficulty
                        )}`}
                      >
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
                      {recipe.title}
                    </h1>

                    {/* Save Button */}
                    <button
                      onClick={toggleSave}
                      disabled={saving}
                      className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isSaved
                          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                      } ${saving && "opacity-50 cursor-not-allowed"}`}
                      aria-label={`${isSaved ? "Unsave" : "Save"} ${
                        recipe.title
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      <span>
                        {saving ? "Saving..." : isSaved ? "Saved" : "Save"}
                      </span>
                    </button>
                  </div>

                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Recipe Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {recipe.prepTime && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-600 mx-auto mb-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">
                          Prep Time
                        </p>
                        <p className="text-sm text-gray-600">
                          {recipe.prepTime}
                        </p>
                      </div>
                    )}
                    {recipe.cookTime && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <svg
                          className="w-6 h-6 text-orange-600 mx-auto mb-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">
                          Cook Time
                        </p>
                        <p className="text-sm text-gray-600">
                          {recipe.cookTime}
                        </p>
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <svg
                          className="w-6 h-6 text-green-600 mx-auto mb-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">
                          Servings
                        </p>
                        <p className="text-sm text-gray-600">
                          {recipe.servings}
                        </p>
                      </div>
                    )}
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg
                        className="w-6 h-6 text-red-600 mx-auto mb-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900">Likes</p>
                      <p className="text-sm text-gray-600">{recipe.likes}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex" aria-label="Recipe details tabs">
                    <button
                      onClick={() => setActiveTab("instructions")}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                        activeTab === "instructions"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Instructions
                    </button>
                    <button
                      onClick={() => setActiveTab("ingredients")}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                        activeTab === "ingredients"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Ingredients
                    </button>
                    <button
                      onClick={() => setActiveTab("nutrition")}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                        activeTab === "nutrition"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Nutrition
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Instructions Tab */}
                  {activeTab === "instructions" && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Cooking Instructions
                      </h3>
                      {instructions.length > 0 ? (
                        <div className="space-y-6">
                          {instructions.map((instruction, index) => (
                            <div key={index} className="flex">
                              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                                {instruction.number}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed">
                                  {instruction.step}
                                </p>

                                {/* Equipment */}
                                {instruction.equipment &&
                                  instruction.equipment.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-gray-600">
                                        Equipment needed:
                                      </p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {instruction.equipment.map(
                                          (item, eqIndex: number) => (
                                            <span
                                              key={eqIndex}
                                              className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
                                            >
                                              {item.name}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Ingredients */}
                                {instruction.ingredients &&
                                  instruction.ingredients.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-gray-600">
                                        Ingredients used:
                                      </p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {instruction.ingredients.map(
                                          (item, ingIndex: number) => (
                                            <span
                                              key={ingIndex}
                                              className="inline-block px-2 py-1 text-xs text-gray-600 bg-green-100 rounded"
                                            >
                                              {item.name}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No instructions available for this recipe.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Ingredients Tab */}
                  {activeTab === "ingredients" && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Ingredients
                      </h3>
                      {ingredients.length > 0 ? (
                        <ul className="space-y-3">
                          {ingredients.map(
                            (ingredient: ExtendedIngredient, index: number) => (
                              <li key={index} className="flex items-center">
                                <svg
                                  className="w-5 h-5 text-green-600 mr-3 shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-gray-700">
                                  {ingredient.amount} {ingredient.unit}{" "}
                                  {ingredient.name}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-600">
                          No ingredients listed for this recipe.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Nutrition Tab */}
                  {activeTab === "nutrition" && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Nutrition Information
                      </h3>
                      {nutritionInfo.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {nutritionInfo.map(
                            (nutrient: NutritionNutrient, index: number) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-900">
                                    {nutrient.name}
                                  </span>
                                  <span className="text-blue-600 font-semibold">
                                    {Math.round(nutrient.amount)}{" "}
                                    {nutrient.unit}
                                  </span>
                                </div>
                                {nutrient.percentOfDailyNeeds && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                      <span>Daily Value</span>
                                      <span>
                                        {Math.round(
                                          nutrient.percentOfDailyNeeds
                                        )}
                                        %
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div className="progress-container">
                                        <div className="progress-bar bg-blue-600 h-2 rounded-full"></div>

                                        <style jsx>{`
                                          .progress-bar {
                                            width: ${Math.min(
                                              nutrient.percentOfDailyNeeds,
                                              100
                                            )}%;
                                            transition: width 0.3s ease-in-out;
                                          }

                                          @media (prefers-reduced-motion: reduce) {
                                            .progress-bar {
                                              transition: none;
                                            }
                                          }
                                        `}</style>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No nutrition information available for this recipe.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              {recipe.author && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recipe Author
                  </h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {recipe.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        Recipe Contributor
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Similar Recipes */}
              {similarRecipes.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Similar Recipes
                  </h3>
                  <div className="space-y-4">
                    {similarRecipes.map((similarRecipe) => (
                      <Link
                        key={similarRecipe.id}
                        href={`/recipe/${similarRecipe.id}`}
                        className="block group"
                      >
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="relative w-16 h-16 shrink-0">
                            {similarRecipe.imageUrl ? (
                              <Image
                                src={similarRecipe.imageUrl}
                                alt={similarRecipe.title}
                                fill
                                className="object-cover rounded-lg"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {similarRecipe.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {similarRecipe.difficulty && (
                                <span
                                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(
                                    similarRecipe.difficulty
                                  )}`}
                                >
                                  {similarRecipe.difficulty}
                                </span>
                              )}
                              {similarRecipe.prepTime && (
                                <span className="text-xs text-gray-500">
                                  {similarRecipe.prepTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SavedPostsProvider>
  );
}
