import { ThemeProvider } from "./components/theme-provider";
import CustomSessionProvider from "./components/SessionProvider"; // Import the client session provider
import { cn } from "./lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "./components/ParticlesBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alex McNicholl - FinTech",
  description: "Portfolio to show off my skills",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ParticlesBackground />
          <CustomSessionProvider> {/* Wrap everything inside the session provider */}
            {children}
          </CustomSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
