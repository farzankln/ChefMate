import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SavedPostsProvider } from "@/components/SavedPostsProvider";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

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

  return (
    <SavedPostsProvider>
      <DashboardClient
        userName={session.user.name || session.user.email || "User"}
        userImage={session.user.image || null}
      />
    </SavedPostsProvider>
  );
}
