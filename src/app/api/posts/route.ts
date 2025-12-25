import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // For now, return mock data until database is set up
    const posts = [
      {
        id: "1",
        title: "Classic Spaghetti Carbonara",
        description:
          "A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        thumbnail:
          "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5",
        author: "Chef Mario",
        category: "Italian",
        prepTime: "10 min",
        cookTime: "15 min",
        servings: "4",
        difficulty: "Medium",
        tags: ["pasta", "italian", "quick", "comfort-food"],
        views: 1247,
        likes: 89,
        createdAt: new Date().toISOString(),
      },
      // Add more posts as needed
    ];

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // In production, check if user has admin role
    const body = await request.json();

    // For now, return mock response
    // In production, create post in database:
    // const newPost = await prisma.post.create({
    //   data: {
    //     title: body.title,
    //     description: body.description,
    //     thumbnail: body.thumbnail,
    //     imageUrl: body.imageUrl,
    //     author: body.author || session.user?.name || "Anonymous",
    //     category: body.category,
    //     prepTime: body.prepTime,
    //     cookTime: body.cookTime,
    //     servings: body.servings,
    //     difficulty: body.difficulty,
    //     tags: body.tags || [],
    //   },
    // });

    const newPost = {
      id: Date.now().toString(),
      ...body,
      author: body.author || session.user?.name || "Anonymous",
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
