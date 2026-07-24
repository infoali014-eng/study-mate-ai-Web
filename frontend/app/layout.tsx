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
  title: "Mr Owl AI",
  description: "Learn Smarter. Revise Faster. Prepare Better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ReactQueryProvider>
          {children}
          {/* Sonner toast system */}
          <Toaster position="top-center" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
