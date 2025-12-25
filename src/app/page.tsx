"use client";

import { useState } from "react";
import ContentCard from "@/components/content-card";
import { useSession } from "next-auth/react";

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

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Classic Spaghetti Carbonara",
    description:
      "A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper. This authentic carbonara recipe is simple yet incredibly flavorful.",
    thumbnail:
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef Mario",
    category: "Italian",
    prepTime: "10 min",
    cookTime: "15 min",
    servings: "4",
    difficulty: "Medium",
    tags: ["pasta", "italian", "quick", "comfort-food"],
    views: 1247,
    likes: 89,
    createdAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Homemade Chicken Tikka Masala",
    description:
      "Tender chicken pieces marinated in yogurt and spices, then cooked in a rich, creamy tomato-based sauce. Perfect with basmati rice or naan bread.",
    thumbnail:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef Priya",
    category: "Indian",
    prepTime: "30 min",
    cookTime: "45 min",
    servings: "6",
    difficulty: "Medium",
    tags: ["chicken", "indian", "spicy", "curry"],
    views: 2156,
    likes: 156,
    createdAt: "2024-12-19T14:30:00Z",
  },
  {
    id: "3",
    title: "Perfect Chocolate Chip Cookies",
    description:
      "Soft, chewy chocolate chip cookies with crispy edges and melty chocolate chips. This foolproof recipe will become your go-to cookie recipe.",
    thumbnail:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Baker Sarah",
    category: "Dessert",
    prepTime: "15 min",
    cookTime: "12 min",
    servings: "24 cookies",
    difficulty: "Easy",
    tags: ["cookies", "chocolate", "dessert", "baking"],
    views: 3421,
    likes: 234,
    createdAt: "2024-12-18T09:15:00Z",
  },
  {
    id: "4",
    title: "Fresh Caesar Salad",
    description:
      "Crisp romaine lettuce, homemade croutons, and a classic Caesar dressing made from scratch. Topped with parmesan cheese and anchovies.",
    thumbnail:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef Laurent",
    category: "Salad",
    prepTime: "20 min",
    cookTime: "0 min",
    servings: "4",
    difficulty: "Easy",
    tags: ["salad", "healthy", "fresh", "quick"],
    views: 987,
    likes: 67,
    createdAt: "2024-12-17T12:00:00Z",
  },
  {
    id: "5",
    title: "Beef Bourguignon",
    description:
      "A classic French beef stew made with red wine, pearl onions, mushrooms, and bacon. Slow-cooked to perfection for incredibly tender meat.",
    thumbnail:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef Antoine",
    category: "French",
    prepTime: "45 min",
    cookTime: "2 hours",
    servings: "6",
    difficulty: "Hard",
    tags: ["beef", "french", "stew", "wine"],
    views: 1789,
    likes: 145,
    createdAt: "2024-12-16T16:45:00Z",
  },
  {
    id: "6",
    title: "Fresh Fish Tacos",
    description:
      "Light and flaky white fish with a crispy coating, served in warm tortillas with cabbage slaw, lime crema, and fresh cilantro.",
    thumbnail:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef Maria",
    category: "Mexican",
    prepTime: "25 min",
    cookTime: "20 min",
    servings: "4",
    difficulty: "Medium",
    tags: ["fish", "mexican", "tacos", "seafood"],
    views: 1534,
    likes: 112,
    createdAt: "2024-12-15T11:20:00Z",
  },
  {
    id: "7",
    title: "Vegetarian Buddha Bowl",
    description:
      "A nutritious bowl packed with quinoa, roasted vegetables, avocado, and a tahini dressing. Perfect for a healthy and satisfying meal.",
    thumbnail:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef Emma",
    category: "Vegetarian",
    prepTime: "20 min",
    cookTime: "30 min",
    servings: "2",
    difficulty: "Easy",
    tags: ["vegetarian", "healthy", "bowl", "quinoa"],
    views: 2103,
    likes: 189,
    createdAt: "2024-12-14T13:30:00Z",
  },
  {
    id: "8",
    title: "Traditional Shepherd's Pie",
    description:
      "A hearty British classic with ground lamb and vegetables topped with creamy mashed potatoes and baked until golden brown.",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    author: "Chef James",
    category: "British",
    prepTime: "30 min",
    cookTime: "45 min",
    servings: "6",
    difficulty: "Medium",
    tags: ["lamb", "comfort-food", "potatoes", "british"],
    views: 1678,
    likes: 134,
    createdAt: "2024-12-13T18:00:00Z",
  },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

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
            Handpicked recipes that our community loves. Like and save your
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
