import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-gray-100">
          Welcome to Chef Mate
        </h1>
        <p className="text-lg text-gray-300">
          Your personal cooking companion. Sign in to access your dashboard and
          start organizing your culinary adventures.
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="block w-full border border-gray-600 text-gray-300 bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
