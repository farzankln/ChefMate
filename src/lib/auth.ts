import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  // CSRF protection is handled automatically by NextAuth
  // - Uses POST for state-changing operations
  // - Generates and verifies CSRF tokens for credentials provider
  // - State parameter is used for OAuth flows
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          // Check if user exists and has a password (credentials user)
          if (!user || !user.password || user.provider !== "credentials") {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user data (excluding sensitive info)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }

      if (account) {
        token.provider = account.provider;
      }

      // OAuth users sync
      if (account && account.provider !== "credentials") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: token.email! },
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: token.email!,
                name: token.name || null,
                image: token.picture || null,
                provider: account.provider,
              },
            });

            token.id = newUser.id;
          } else {
            token.id = existingUser.id;

            await prisma.user.update({
              where: { email: token.email! },
              data: {
                provider: account.provider,
                image: token.picture || existingUser.image,
                name: token.name || existingUser.name,
              },
            });
          }
        } catch (error) {
          // Log error with details for debugging
          console.error("OAuth user sync error:", error);
          // Add error to token so it can be handled in session callback
          token.oauthError =
            error instanceof Error ? error.message : "OAuth sync failed";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      if (token.provider) {
        session.provider = token.provider as string;
      }

      return session;
    },
    async signIn({ user, account }) {
      // Additional validation for OAuth providers
      if (account && account.provider !== "credentials") {
        // Ensure we have required user data
        if (!user.email) {
          return false;
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
