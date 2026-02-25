import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate postId
  if (!postId || typeof postId !== "string" || postId.length > 50) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  try {
    await prisma.savedPost.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE saved-post error:", error);
    return NextResponse.json(
      { error: "Failed to delete saved post" },
      { status: 500 },
    );
  }
}
