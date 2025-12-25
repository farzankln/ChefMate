"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      </div>
    </div>
  );
}
