import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers/providers";
import Navigation from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import { SavedPostsProvider } from "@/components/SavedPostsProvider";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chef Mate - Your Personal Cooking Companion",
  description:
    "Organize your recipes, plan meals, and enhance your cooking experience with Chef Mate.",
  keywords: ["cooking", "recipes", "meal planning", "chef", "food"],
  creator: "Chef Mate",
  publisher: "Chef Mate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chef-mate.vercel.app",
    siteName: "Chef Mate",
    title: "Chef Mate - Your Personal Cooking Companion",
    description:
      "Organize your recipes, plan meals, and enhance your cooking experience with Chef Mate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chef Mate - Your Personal Cooking Companion",
    description:
      "Organize your recipes, plan meals, and enhance your cooking experience with Chef Mate.",
    creator: "@chefmate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navigation />
          <SavedPostsProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </SavedPostsProvider>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
