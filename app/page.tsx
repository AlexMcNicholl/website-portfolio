"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ensure Button supports asChild
import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-6" /> {/* Placeholder image */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Hi, I'm [Your Name]</h1>
        <p className="text-lg text-muted-foreground">FinTech Enthusiast • AI Developer • Product Thinker</p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
          <Button variant="outline">
            <Link href="/projects" className="inline-block w-full h-full">
              View Projects
            </Link>
          </Button>
        </div>

        {/* Social Icons */}
        <div className="mt-6 flex justify-center gap-6">
          <Link href="https://github.com/your-username" target="_blank" aria-label="GitHub">
            <Github className="w-6 h-6 hover:text-primary transition" />
          </Link>
          <Link href="https://linkedin.com/in/your-linkedin" target="_blank" aria-label="LinkedIn">
            <Linkedin className="w-6 h-6 hover:text-primary transition" />
          </Link>
          <Link href="mailto:your@email.com" aria-label="Email">
            <Mail className="w-6 h-6 hover:text-primary transition" />
          </Link>
        </div>
      </div>
    </main>
  );
}
