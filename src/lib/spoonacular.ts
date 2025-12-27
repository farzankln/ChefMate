const BASE_URL = "https://api.spoonacular.com";

const apiKey = (process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY ||
  process.env.SPOONACULAR_API_KEY) as string;

if (!apiKey) {
  throw new Error("Spoonacular API key is missing");
}

type ComplexSearchParams = {
  type?: string;
  number?: number;
  offset?: number;
};

export async function complexSearch(params: ComplexSearchParams) {
  const query = new URLSearchParams();
  query.append("apiKey", apiKey);
  query.append("number", String(params.number ?? 10));
  if (params.type) query.append("type", params.type);
  if (params.offset) query.append("offset", String(params.offset));

  const res = await fetch(
    `${BASE_URL}/recipes/complexSearch?${query.toString()}`,
    {
      next: { revalidate: 3600 }, // ISR
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}

type RecipeInfoParams = {
  ids: string;
  includeNutrition?: boolean;
};

export async function getRecipeInformationBulk(params: RecipeInfoParams) {
  const query = new URLSearchParams();
  query.append("apiKey", apiKey);
  query.append("ids", params.ids);
  if (params.includeNutrition)
    query.append("includeNutrition", String(params.includeNutrition));

  const res = await fetch(
    `${BASE_URL}/recipes/informationBulk?${query.toString()}`,
    {
      next: { revalidate: 3600 }, // ISR
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recipe information");
  }

  return res.json();
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  pricePerServing: number;
  aggregatedLikes: number;
  healthScore: number;
  spoonacularScore: number;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  winePairing: {
    pairedWines: string[];
    pairingText: string;
    productMatches: unknown[];
  };
  instructions: unknown[];
  analyzedInstructions: unknown[];
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }>;
  };
  tips: {
    property: string;
    value: string;
  };
  author: string;
  difficulty: string;
  tags: string[];
}

interface SearchResult {
  id: number;
}

// Map Spoonacular recipe to our Post interface
export function mapSpoonacularToPost(recipe: SpoonacularRecipe) {
  return {
    id: recipe.id.toString(),
    title: recipe.title,
    description: recipe.summary.replace(/<[^>]*>/g, ""), // Strip HTML tags
    thumbnail: recipe.image,
    imageUrl: recipe.image,
    author: recipe.author || "Chef Spoonacular",
    category: recipe.cuisines.length > 0 ? recipe.cuisines[0] : "International",
    prepTime:
      recipe.readyInMinutes > 0
        ? `${Math.floor(recipe.readyInMinutes / 2)} min`
        : "10 min",
    cookTime:
      recipe.readyInMinutes > 0
        ? `${Math.ceil(recipe.readyInMinutes / 2)} min`
        : "15 min",
    servings: recipe.servings.toString(),
    difficulty:
      recipe.difficulty ||
      (recipe.healthScore > 70
        ? "Easy"
        : recipe.healthScore > 40
        ? "Medium"
        : "Hard"),
    tags: recipe.diets.concat(recipe.cuisines.slice(0, 2)),
    likes: recipe.aggregatedLikes || 0,
    createdAt: new Date().toISOString(),
  };
}

// Get featured recipes with detailed information
export async function getFeaturedRecipes() {
  try {
    // First get a list of popular recipes
    const searchResult = await complexSearch({
      type: "main course",
      number: 20, // Get more recipes to have better selection
    });

    if (!searchResult.results || searchResult.results.length === 0) {
      throw new Error("No recipes found");
    }

    // Extract IDs and get detailed information
    const recipeIds = searchResult.results
      .map((recipe: SearchResult) => recipe.id)
      .join(",");
    const detailedRecipes = await getRecipeInformationBulk({ ids: recipeIds });

    // Map to our Post interface and return first 12
    const mappedRecipes = detailedRecipes
      .map(mapSpoonacularToPost)
      .slice(0, 12);

    return mappedRecipes;
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    // Return mock data as fallback
    return getMockRecipes();
  }
}

// Get similar recipes
export async function getSimilarRecipes(recipeId: number, number: number = 4) {
  try {
    const query = new URLSearchParams();
    query.append("apiKey", apiKey);
    query.append("number", String(number));

    const res = await fetch(
      `${BASE_URL}/recipes/${recipeId}/similar?${query.toString()}`,
      {
        next: { revalidate: 3600 }, // ISR
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch similar recipes");
    }

    const similarRecipes: Array<{ id: number; title: string }> =
      await res.json();

    // Get detailed information for each similar recipe
    const recipeIds = similarRecipes.map((recipe) => recipe.id).join(",");
    const detailedRecipes = await getRecipeInformationBulk({ ids: recipeIds });

    // Map to our Post interface
    const mappedRecipes = detailedRecipes.map(mapSpoonacularToPost);

    return mappedRecipes;
  } catch (error) {
    console.error("Error fetching similar recipes:", error);
    // Return mock data as fallback
    return getMockSimilarRecipes();
  }
}

// Mock data for fallback when API is unavailable
function getMockRecipes() {
  const mockRecipes = [
    {
      id: "6548",
      title: "Classic Spaghetti Carbonara",
      description:
        "A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
      thumbnail: "https://spoonacular.com/recipeImages/6548-312x231.jpg",
      imageUrl: "https://spoonacular.com/recipeImages/6548-556x370.jpg",
      author: "Chef Mario",
      category: "Italian",
      prepTime: "10 min",
      cookTime: "15 min",
      servings: "4",
      difficulty: "Medium",
      tags: ["pasta", "italian", "quick", "comfort-food"],
      likes: 89,
      createdAt: new Date().toISOString(),
    },
    {
      id: "7154",
      title: "Chicken Tikka Masala",
      description:
        "Tender chicken pieces in a rich, creamy tomato-based curry sauce.",
      thumbnail: "https://spoonacular.com/recipeImages/7154-312x231.jpg",
      imageUrl: "https://spoonacular.com/recipeImages/7154-556x370.jpg",
      author: "Chef Priya",
      category: "Indian",
      prepTime: "20 min",
      cookTime: "30 min",
      servings: "6",
      difficulty: "Medium",
      tags: ["chicken", "curry", "indian", "spicy"],
      likes: 156,
      createdAt: new Date().toISOString(),
    },
    {
      id: "6445",
      title: "Beef Tacos",
      description:
        "Soft corn tortillas filled with seasoned ground beef, fresh vegetables, and cheese.",
      thumbnail: "https://spoonacular.com/recipeImages/6445-312x231.jpg",
      imageUrl: "https://spoonacular.com/recipeImages/6445-556x370.jpg",
      author: "Chef Carlos",
      category: "Mexican",
      prepTime: "15 min",
      cookTime: "20 min",
      servings: "4",
      difficulty: "Easy",
      tags: ["beef", "mexican", "tacos", "family-friendly"],
      likes: 72,
      createdAt: new Date().toISOString(),
    },
    {
      id: "7825",
      title: "Greek Salad",
      description:
        "Fresh cucumber, tomato, red onion, olives, and feta cheese with olive oil dressing.",
      thumbnail: "https://spoonacular.com/recipeImages/7825-312x231.jpg",
      imageUrl: "https://spoonacular.com/recipeImages/7825-556x370.jpg",
      author: "Chef Demetri",
      category: "Greek",
      prepTime: "10 min",
      cookTime: "0 min",
      servings: "4",
      difficulty: "Easy",
      tags: ["salad", "vegetarian", "mediterranean", "healthy"],
      likes: 45,
      createdAt: new Date().toISOString(),
    },
  ];

  return mockRecipes;
}

function getMockRecipeById(recipeId: string) {
  const mockRecipes = getMockRecipes();
  const recipe = mockRecipes.find((r) => r.id === recipeId);

  if (recipe) {
    return {
      ...recipe,
      originalRecipe: {
        analyzedInstructions: [
          {
            steps: [
              {
                number: 1,
                step: "Bring a large pot of salted water to boil for the pasta.",
                ingredients: [{ name: "water" }, { name: "salt" }],
                equipment: [{ name: "large pot" }],
              },
              {
                number: 2,
                step: "Cook pasta according to package directions until al dente.",
                ingredients: [{ name: "spaghetti" }],
                equipment: [{ name: "colander" }],
              },
              {
                number: 3,
                step: "In a bowl, whisk together eggs, grated cheese, and black pepper.",
                ingredients: [
                  { name: "eggs" },
                  { name: "parmesan cheese" },
                  { name: "black pepper" },
                ],
                equipment: [{ name: "large bowl" }, { name: "whisk" }],
              },
              {
                number: 4,
                step: "Drain pasta, reserving 1 cup of pasta water.",
                ingredients: [],
                equipment: [{ name: "colander" }],
              },
              {
                number: 5,
                step: "Add hot pasta to the egg mixture and toss quickly to prevent scrambling.",
                ingredients: [],
                equipment: [],
              },
              {
                number: 6,
                step: "Add pancetta and toss again. Serve immediately with extra cheese.",
                ingredients: [
                  { name: "pancetta" },
                  { name: "parmesan cheese" },
                ],
                equipment: [],
              },
            ],
          },
        ],
        nutrition: {
          nutrients: [
            {
              name: "Calories",
              amount: 450,
              unit: "kcal",
              percentOfDailyNeeds: 22,
            },
            { name: "Fat", amount: 18, unit: "g", percentOfDailyNeeds: 28 },
            {
              name: "Carbohydrates",
              amount: 52,
              unit: "g",
              percentOfDailyNeeds: 17,
            },
            { name: "Protein", amount: 22, unit: "g", percentOfDailyNeeds: 44 },
            { name: "Fiber", amount: 3, unit: "g", percentOfDailyNeeds: 12 },
            { name: "Sugar", amount: 3, unit: "g", percentOfDailyNeeds: 3 },
            {
              name: "Sodium",
              amount: 890,
              unit: "mg",
              percentOfDailyNeeds: 37,
            },
          ],
        },
        extendedIngredients: [
          { amount: 400, unit: "g", name: "spaghetti" },
          { amount: 4, unit: "large", name: "eggs" },
          { amount: 100, unit: "g", name: "parmesan cheese, grated" },
          { amount: 200, unit: "g", name: "pancetta, diced" },
          { amount: 1, unit: "tsp", name: "black pepper, freshly ground" },
          { amount: 2, unit: "tbsp", name: "olive oil" },
          { amount: 1, unit: "tsp", name: "salt" },
        ],
      },
    };
  }

  return null;
}

function getMockSimilarRecipes() {
  return getMockRecipes().slice(0, 4);
}

// Get detailed recipe information by ID
export async function getRecipeById(recipeId: string) {
  try {
    const query = new URLSearchParams();
    query.append("apiKey", apiKey);
    query.append("includeNutrition", "true");

    const res = await fetch(
      `${BASE_URL}/recipes/${recipeId}/information?${query.toString()}`,
      {
        next: { revalidate: 3600 }, // ISR
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch recipe details");
    }

    const recipe = await res.json();

    return {
      ...mapSpoonacularToPost(recipe),
      originalRecipe: recipe,
    };
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    // Return mock data as fallback
    const mockRecipe = getMockRecipeById(recipeId);
    if (mockRecipe) {
      return mockRecipe;
    }
    throw error;
  }
}

// Get random recipes
export async function getRandomRecipes(number: number = 8) {
  try {
    const query = new URLSearchParams();
    query.append("apiKey", apiKey);
    query.append("number", String(number));
    query.append("tags", "vegetarian,main course,dessert");

    const res = await fetch(`${BASE_URL}/recipes/random?${query.toString()}`, {
      next: { revalidate: 1800 }, // ISR
    });

    if (!res.ok) {
      throw new Error("Failed to fetch random recipes");
    }

    const data = await res.json();

    // Map to our Post interface
    const mappedRecipes = data.recipes.map(mapSpoonacularToPost);

    return mappedRecipes;
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    throw error;
  }
}
