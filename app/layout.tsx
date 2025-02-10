import { ThemeProvider } from "./components/theme-provider";
import { cn } from "./lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "./components/ParticlesBackground";
import { SessionProvider } from "next-auth/react";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alex McNicholl - FinTech",
  description: "Portfolio to show off my skills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ParticlesBackground /> {/* Background Particles */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
