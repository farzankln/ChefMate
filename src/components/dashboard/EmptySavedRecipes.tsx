"use client";
import { useRouter } from "next/navigation";
import { EmptyState } from "../ui/EmptyState";
import { LuBookmark } from "react-icons/lu";
import { FiSearch, FiCheck, FiLock, FiHeart } from "react-icons/fi";

export default function EmptySavedRecipes() {
  const router = useRouter();

  const handleDiscoverRecipes = () => {
    router.push("/");
  };

  const bookmarkIcon = <LuBookmark className="h-12 w-12 text-blue-600" />;

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
      features={[
        {
          icon: <FiCheck className="w-5 h-5 text-green-600" />,
          label: "Easy to Save",
        },
        {
          icon: <FiLock className="w-5 h-5 text-purple-600" />,
          label: "Always Accessible",
        },
        {
          icon: <FiHeart className="w-5 h-5 text-orange-600" />,
          label: "Organized Collection",
        },
      ]}
    />
  );
}
