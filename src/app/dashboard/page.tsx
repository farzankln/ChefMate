"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="p-10 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Welcome {userName}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          {hasImage ? (
            <Image
              src={user.image!}
              alt={userName}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${getProviderColor(
                provider
              )}`}
            >
              {getInitials(userName)}
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-600">
            {hasImage
              ? `Profile picture from ${provider}`
              : `Default avatar (manual account)`}
          </p>
          <p className="text-sm text-gray-500">Email: {user?.email}</p>
        </div>
      </div>
    </div>
  );
}
