"use client";
import { LuBookmark } from "react-icons/lu";

export default function EmptySavedRecipes() {
  return (
    <div className="text-center py-12">
      <LuBookmark className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No saved recipes yet
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Start saving recipes to see them here.
      </p>
    </div>
  );
}
