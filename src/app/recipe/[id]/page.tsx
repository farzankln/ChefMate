import RecipeClient from "../../../components/recipe/RecipeClient";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <RecipeClient id={resolvedParams.id} />;
}
