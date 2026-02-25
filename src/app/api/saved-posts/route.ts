import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPostDataById, mapPostToSavedPostData } from "@/lib/saved-posts";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const formattedPosts = savedPosts.map((savedPost) => ({
      id: savedPost.id,
      postId: savedPost.postId,
      userId: savedPost.userId,
      createdAt: savedPost.createdAt,
      source: savedPost.source,
      title: savedPost.title,
      description: savedPost.description,
      thumbnail: savedPost.thumbnail,
      imageUrl: savedPost.imageUrl,
      category: savedPost.category,
      prepTime: savedPost.prepTime,
      cookTime: savedPost.cookTime,
      servings: savedPost.servings,
      difficulty: savedPost.difficulty,
      tags: savedPost.tags,
      // Enhanced recipe data fields
      ingredients: savedPost.ingredients,
      instructions: savedPost.instructions,
      nutrition: savedPost.nutrition,
      post: {
        id: savedPost.postId,
        title: savedPost.title,
        description: savedPost.description,
        thumbnail: savedPost.thumbnail,
        imageUrl: savedPost.imageUrl,
        category: savedPost.category,
        prepTime: savedPost.prepTime,
        cookTime: savedPost.cookTime,
        servings: savedPost.servings,
        difficulty: savedPost.difficulty,
        tags: savedPost.tags,
      },
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("GET saved-posts error:", error);
    return NextResponse.json(
      { error: "Failed to load saved posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate request body with proper error handling
  let postId: string;
  try {
    const body = await req.json();
    postId = body.postId;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  if (!postId || typeof postId !== "string" || postId.length > 50) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  try {
    const { post: postData, source } = await getPostDataById(postId);

    const savedPost = await prisma.savedPost.create({
      data: mapPostToSavedPostData(postId, session.user.id, postData, source),
    });

    return NextResponse.json(savedPost, { status: 201 });
  } catch (error: unknown) {
    // Handle Prisma unique constraint violation (P2002)
    if (
      error instanceof Error &&
      "code" in error &&
      typeof error.code === "string" &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Post already saved" },
        { status: 409 },
      );
    }

    console.error("POST saved-posts error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save post";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
