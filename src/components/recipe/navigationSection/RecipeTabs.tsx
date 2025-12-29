"use client";

import { useState } from "react";
import RecipeInstructions from "./tabs/RecipeInstructions";
import RecipeIngredients from "./tabs/RecipeIngredients";
import RecipeNutrition from "./tabs/RecipeNutrition";
import { Recipe } from "@/types/recipe";

interface RecipeTabsProps {
  recipe: Recipe;
}

export default function RecipeTabs({ recipe }: RecipeTabsProps) {
  const [tab, setTab] = useState("instructions");

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex border-b">
        {["instructions", "ingredients", "nutrition"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-4 ${
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "instructions" && <RecipeInstructions recipe={recipe} />}
        {tab === "ingredients" && <RecipeIngredients recipe={recipe} />}
        {tab === "nutrition" && <RecipeNutrition recipe={recipe} />}
      </div>
    </div>
  );
}
