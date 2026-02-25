import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Redirect to login page instead of showing generic message
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <DashboardClient
      userName={session.user.name || session.user.email || "User"}
      userImage={session.user.image || null}
    />
  );
}
