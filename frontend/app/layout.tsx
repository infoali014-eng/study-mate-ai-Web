import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://deepcode.ai"),
  title: {
    default: "DeepCode - Interactive Developer Platform",
    template: "%s | DeepCode",
  },
  description:
    "DeepCode is your all-in-one platform to learn in-depth, build real-world projects, and connect with a global community of developers.",
  icons: {
    icon: [
      { url: "/branding/deepcode/logo.png?v=2", type: "image/png" },
      { url: "/icon.png?v=2", type: "image/png" },
      { url: "/favicon.ico?v=2" },
    ],
    shortcut: "/branding/deepcode/logo.png?v=2",
    apple: "/apple-icon.png?v=2",
  },
  openGraph: {
    title: "DeepCode - Interactive Developer Platform",
    description: "Learn in-depth, build real-world projects, and grow together.",
    siteName: "DeepCode",
    images: [
      {
        url: "/branding/deepcode/logo.png",
        width: 800,
        height: 600,
        alt: "DeepCode Logo",
      },
    ],
  },
};

import { TopLoader } from "@/components/ui/TopLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ReactQueryProvider>
          <TopLoader />
          {children}
          {/* Sonner toast system */}
          <Toaster position="top-center" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
