"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ContentCard from "@/components/content-card";

interface Lock {
  id: string;
  postId: string;
  createdAt: string;
  post: {
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
    tags?: string[];
    views: number;
    likes: number;
    createdAt: string;
  };
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getProviderColor(provider: string | null | undefined): string {
  // Return red for manual accounts (credentials provider)
  if (provider === "credentials") {
    return "bg-red-500";
  }
  // Default fallback color
  return "bg-blue-500";
}

function getProviderDisplayName(provider: string | null | undefined): string {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "credentials":
      return "Email & Password";
    default:
      return "Unknown";
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [locks, setLocks] = useState<Lock[]>([]);
  const [locksLoading, setLocksLoading] = useState(false);
  const [locksError, setLocksError] = useState<string | null>(null);

  // Fetch user's locked posts
  useEffect(() => {
    if (status === "authenticated") {
      fetchLocks();
    }
  }, [status]);

  const fetchLocks = async () => {
    try {
      setLocksLoading(true);
      setLocksError(null);

      const response = await fetch("/api/locks");

      if (!response.ok) {
        throw new Error("Failed to fetch locks");
      }

      const data = await response.json();
      setLocks(data.locks || []);
    } catch (error) {
      console.error("Error fetching locks:", error);
      setLocksError("Failed to load your saved recipes");
    } finally {
      setLocksLoading(false);
    }
  };

  const handleLikeToggle = (postId: string, isLiked: boolean) => {
    // Handle like toggle for locked posts
    console.log(`Toggled like for post ${postId}: ${isLiked}`);
  };

  const handleViewIncrement = (postId: string) => {
    // Handle view increment for locked posts
    console.log(`Incremented view for post ${postId}`);
  };

  const handleUnlockPost = async (postId: string) => {
    try {
      const response = await fetch("/api/locks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        // Remove from locks list
        setLocks((prevLocks) =>
          prevLocks.filter((lock) => lock.postId !== postId)
        );
      }
    } catch (error) {
      console.error("Error unlocking post:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 p-10 flex items-center justify-center">
        <div className="text-lg text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;
  const hasImage = user?.image;
  const provider = session.provider || "credentials";
  const userName = user?.name || user?.email || "User";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-100">
            Welcome back, {userName}!
          </h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {hasImage ? (
                <Image
                  src={user.image!}
                  alt={userName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl ${getProviderColor(
                    provider
                  )}`}
                >
                  {getInitials(userName)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-100 mb-1">
                {userName}
              </h2>
              <p className="text-gray-300 mb-2">
                {hasImage
                  ? `Profile picture from ${getProviderDisplayName(provider)}`
                  : `Default avatar (${getProviderDisplayName(
                      provider
                    )} account)`}
              </p>
              <p className="text-sm text-gray-400">Email: {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">
            Your Cooking Journey Starts Here
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Welcome to your Chef Mate dashboard! Here you&apos;ll be able to
            organize your recipes, plan your meals, and track your culinary
            adventures. We&apos;re excited to help you become a better cook.
          </p>
        </div>

        {/* User's Locks Collection */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Saved recipes"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Your Saved Recipes ({locks.length})
            </h3>
            <button
              onClick={fetchLocks}
              disabled={locksLoading}
              className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
            >
              {locksLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Loading State */}
          {locksLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-300">
                Loading your saved recipes...
              </span>
            </div>
          )}

          {/* Error State */}
          {locksError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
                <span className="text-red-700">{locksError}</span>
              </div>
            </div>
          )}

          {/* Locks Grid */}
          {!locksLoading && !locksError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locks.map((lock) => (
                <div key={lock.id} className="relative">
                  <ContentCard
                    post={lock.post}
                    onLikeToggle={handleLikeToggle}
                    onViewIncrement={handleViewIncrement}
                    isLocked={true}
                  />
                  {/* Unlock Button Overlay */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => handleUnlockPost(lock.postId)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      aria-label={`Unlock ${lock.post.title}`}
                      title="Unlock recipe"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!locksLoading && !locksError && locks.length === 0 && (
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">
                No saved recipes yet
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Start exploring recipes and save your favorites for quick access
                later.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Browse Recipes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
