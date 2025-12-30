"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

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
    <div className="bg-gradient-to-br from-red-600 via-red-800 to-red-950 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
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
              Welcome back, {userName}.
            </h1>
            <p className="text-blue-100 text-lg">
              Discover and manage your saved recipes
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-6 py-3 bg-red-600 hover:bg-red-600/80 text-white font-medium rounded-lg
             transition-all duration-200 hover:scale-105
             flex items-center justify-center gap-2 text-center"
        >
          <FiLogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
