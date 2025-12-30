"use client";

import RecipeInstructions from "./tabs/RecipeInstructions";
import RecipeIngredients from "./tabs/RecipeIngredients";
import RecipeNutrition from "./tabs/RecipeNutrition";
import { Tabs, Tab } from "@/components/ui/Tabs";
import { Recipe } from "@/types/recipe";
import { FiList, FiCheckSquare, FiActivity } from "react-icons/fi";

interface RecipeTabsProps {
  recipe: Recipe;
}

export default function RecipeTabs({ recipe }: RecipeTabsProps) {
  const instructionsIcon = <FiList className="w-4 h-4" />;

  const ingredientsIcon = <FiCheckSquare className="w-4 h-4" />;

  const nutritionIcon = <FiActivity className="w-4 h-4" />;

  const tabs: Tab[] = [
    {
      id: "instructions",
      label: "Instructions",
      icon: instructionsIcon,
      content: <RecipeInstructions recipe={recipe} />,
    },
    {
      id: "ingredients",
      label: "Ingredients",
      icon: ingredientsIcon,
      content: <RecipeIngredients recipe={recipe} />,
    },
    {
      id: "nutrition",
      label: "Nutrition",
      icon: nutritionIcon,
      content: <RecipeNutrition recipe={recipe} />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Tabs tabs={tabs} defaultTab="instructions" variant="default" />
    </div>
  );
}
