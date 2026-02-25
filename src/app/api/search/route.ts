import { NextRequest, NextResponse } from "next/server";
import { searchRecipes } from "@/lib/spoonacular";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || undefined;
  const cuisine = searchParams.get("cuisine") || undefined;
  const diet = searchParams.get("diet") || undefined;
  const intolerances = searchParams.get("intolerances") || undefined;
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const number = parseInt(searchParams.get("number") || "12", 10);

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  try {
    const results = await searchRecipes({
      query,
      type,
      cuisine,
      diet,
      intolerances,
      number,
      offset,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search recipes" },
      { status: 500 },
    );
  }
}
