"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  userName: string;
  userImage?: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function DashboardHeader({
  userName,
  userImage,
}: DashboardHeaderProps) {
  const initials = getInitials(userName);

  return (
    <div className="rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white text-2xl font-bold">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              initials
            )}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {userName}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and explore your saved recipes
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
