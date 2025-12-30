"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { FiCheck, FiList, FiSearch, FiLogOut } from "react-icons/fi";

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
    <div className="bg-liner-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-2xl font-bold text-white">{initials}</span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-blue-100 text-lg">
              Discover and manage your saved recipes
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-blue-200">
              <div className="flex items-center gap-1">
                <FiCheck className="w-4 h-4" />
                <span>Verified Chef</span>
              </div>
              <div className="flex items-center gap-1">
                <FiList className="w-4 h-4" />
                <span>Recipe Collector</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50"
          >
            <div className="flex items-center gap-2">
              <FiSearch className="w-4 h-4" />
              Explore Recipes
            </div>
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-3 bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90 text-white font-medium rounded-lg transition-all duration-200 border border-red-400/50 hover:border-red-300/70"
          >
            <div className="flex items-center gap-2">
              <FiLogOut className="w-4 h-4" />
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
