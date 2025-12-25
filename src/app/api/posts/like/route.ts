import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/posts/like - Toggle like on a post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { postId, isLiked } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // For now, just return success
    // In production, this would:
    // 1. Check if user has already liked the post
    // 2. Update the Like/Lock table in database
    // 3. Update the post's like count
    // 4. Return the updated like count

    console.log(
      `User ${session.user?.email} ${
        isLiked ? "liked" : "unliked"
      } post ${postId}`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Post ${isLiked ? "liked" : "unliked"} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
