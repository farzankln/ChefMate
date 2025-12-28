"use client";

import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  postTitle,
}: AuthModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    // Store the current URL for after login
    sessionStorage.setItem("returnUrl", window.location.href);
    onClose();
    router.push("/login");
  };

  const handleRegister = () => {
    // Store the current URL for after registration
    sessionStorage.setItem("returnUrl", window.location.href);
    onClose();
    router.push("/register");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sign in to save recipes
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              {postTitle ? (
                <>
                  You need to sign in to save &quot;{postTitle}&quot; and access
                  it from any device.
                </>
              ) : (
                "Create an account or sign in to save your favorite recipes and access them from any device."
              )}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>

              <button
                onClick={handleRegister}
                className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Create Account
              </button>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Continue without signing in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
