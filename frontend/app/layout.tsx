import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OwlContainer from "@/features/owl/components/OwlContainer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudyMate AI",
  description: "Learn Smarter. Revise Faster. Prepare Better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {/* Persistent mascot overlay */}
        <OwlContainer />
      </body>
    </html>
  );
}
