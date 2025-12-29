import Link from "next/link";
import Image from "next/image";
import { SimilarRecipe } from "@/types/recipe";

interface SimilarRecipesProps {
  recipes: SimilarRecipe[];
}

export default function SimilarRecipes({ recipes }: SimilarRecipesProps) {
  if (!recipes?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold mb-4">Similar Recipes</h3>

      <div className="space-y-4">
        {recipes.map((r: SimilarRecipe) => (
          <Link
            key={r.id}
            href={`/recipe/${r.id}`}
            className="flex gap-3 hover:bg-gray-50 p-2 rounded"
          >
            {r.imageUrl && (
              <Image
                src={r.imageUrl}
                alt={r.title}
                width={64}
                height={64}
                className="rounded object-cover"
              />
            )}
            <p className="text-sm font-medium line-clamp-2">{r.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
