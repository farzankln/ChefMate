import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
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
            user.password
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
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        token.provider = account.provider;
      }

      // For OAuth users, ensure they exist in our database
      if (account && account.provider && account.provider !== "credentials") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: token.email! },
          });

          if (!existingUser) {
            // Create user for OAuth provider
            await prisma.user.create({
              data: {
                email: token.email!,
                name: token.name || null,
                image: token.picture || null,
                provider: account.provider,
              },
            });
          } else {
            // Update existing user's provider info if needed
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
          console.error("OAuth user sync error:", error);
          // Don't fail the auth process for sync errors
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Pass provider to session
      if (token.provider) {
        session.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
