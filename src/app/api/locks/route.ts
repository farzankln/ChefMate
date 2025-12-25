import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/locks - Get user's locked posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // For now, return mock data
    // In production, this would query the Lock table
    const locks = [
      {
        id: "1",
        postId: "1",
        post: {
          id: "1",
          title: "Classic Spaghetti Carbonara",
          description:
            "A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
          thumbnail:
            "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5",
          author: "Chef Mario",
          category: "Italian",
          views: 1247,
          likes: 89,
          createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        postId: "3",
        post: {
          id: "3",
          title: "Perfect Chocolate Chip Cookies",
          description:
            "Soft, chewy chocolate chip cookies with crispy edges and melty chocolate chips.",
          thumbnail:
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
          author: "Baker Sarah",
          category: "Dessert",
          views: 3421,
          likes: 234,
          createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ locks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching locks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
