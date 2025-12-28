import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First get saved post IDs for this user
    const savedPostRecords = await prisma.savedPost.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        postId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Separate internal posts (valid ObjectIDs) from external recipe IDs
    const internalPostIds = savedPostRecords
      .filter((sp) => sp.postId.length === 24) // Valid ObjectID length
      .map((sp) => sp.postId);

    // Fetch internal posts separately
    let internalPosts = [];
    if (internalPostIds.length > 0) {
      internalPosts = await prisma.post.findMany({
        where: {
          id: {
            in: internalPostIds,
          },
        },
      });
    }

    // Combine results
    const formattedPosts = savedPostRecords.map((record) => ({
      ...record,
      post: internalPosts.find((p) => p.id === record.postId) || null,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("GET saved-posts error:", error);
    return NextResponse.json(
      { error: "Failed to load saved posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  try {
    const savedPost = await prisma.savedPost.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });

    return NextResponse.json(savedPost, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Post already saved" },
        { status: 409 }
      );
    }

    console.error("POST saved-posts error:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
