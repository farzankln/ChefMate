"use client";
import { useRouter } from "next/navigation";
import { EmptyState } from "../ui/EmptyState";
import { LuBookmark } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";

export default function EmptySavedRecipes() {
  const router = useRouter();

  const handleDiscoverRecipes = () => {
    router.push("/");
  };

  const bookmarkIcon = <LuBookmark className="h-12 w-12 text-red-600" />;

  return (
    <EmptyState
      icon={bookmarkIcon}
      title="Your Recipe Collection Awaits"
      description="Start building your personal cookbook by saving delicious recipes you love. Discover amazing dishes from around the world and never lose track of your favorites."
      action={{
        label: "Discover Recipes",
        onClick: handleDiscoverRecipes,
        icon: <FiSearch className="w-5 h-5" />,
      }}
    />
  );
}
