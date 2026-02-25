"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LuChefHat } from "react-icons/lu";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const user = session?.user;
  const isAuthenticated = status === "authenticated";

  return (
    <nav
      className="sticky top-0 z-50 bg-white shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-900 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white rounded-md p-1"
              aria-label="Chef Mate - Home"
            >
              <div className="w-8 h-8 bg-linear-to-br rounded-lg flex items-center justify-center">
                <LuChefHat
                  className="text-red-600 flex items-center justify-center"
                  size={32}
                />
              </div>
              <span className="text-xl font-bold hidden sm:block">
                Chef Mate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                aria-label="Home"
              >
                Home
              </Link>

              <Link
                href="/search"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                aria-label="Search"
              >
                Search
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                    aria-label="Dashboard"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                    aria-label="Sign in"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                    aria-label="Create account"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Profile (Desktop) */}
          {isAuthenticated && user && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || user.email || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                  />
                ) : (
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-600 text-sm">
                  {user.name || user.email}
                </span>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white inline-flex items-center justify-center p-2 rounded-md"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <FiMenu
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                aria-hidden="true"
              />
              <FiX
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          <Link
            href="/"
            className="text-gray-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            aria-label="Home"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/search"
            className="text-gray-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            aria-label="Search"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiSearch className="inline-block mr-2" />
            Search
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                aria-label="Dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                aria-label="Sign out"
              >
                Sign Out
              </button>

              {/* User Profile (Mobile) */}
              {user && (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || user.email || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-medium">
                        {(user.name || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-900">
                        {user.name || "User"}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                aria-label="Sign in"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-red-600 text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                aria-label="Create account"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
