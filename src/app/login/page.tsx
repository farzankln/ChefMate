"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80 space-y-4 border p-6 rounded">
        <h1 className="text-xl font-bold">Login</h1>

        <form onSubmit={handleCredentials} className="space-y-2">
          <input
            name="email"
            placeholder="Email"
            className="w-full border p-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2"
          />
          <button className="w-full bg-black text-white p-2">Login</button>
        </form>

        <hr />

        <button onClick={() => signIn("google")} className="w-full border p-2">
          Login with Google
        </button>

        <button onClick={() => signIn("github")} className="w-full border p-2">
          Login with GitHub
        </button>
      </div>
    </div>
  );
}
