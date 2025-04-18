"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ensure Button supports asChild
import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="relative mx-auto mb-6">
          {/* Profile Image Container */}
          <div className="w-56 h-56 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 mx-auto overflow-hidden shadow-lg">
            <img
              src="/profile.jpg" // Replace with the actual file name of your photo
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Hi, I'm Alex McNicholl</h1>
        <p className="text-lg text-muted-foreground">FinTech Enthusiast • Recent Finance Graduate</p>

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
          <Link href="https://github.com/AlexMcNicholl" target="_blank" aria-label="GitHub">
            <Github className="w-6 h-6 hover:text-primary transition" />
          </Link>
          <Link href="https://linkedin.com/in/amcnicholl" target="_blank" aria-label="LinkedIn">
            <Linkedin className="w-6 h-6 hover:text-primary transition" />
          </Link>
          <Link href="mailto:amcnicholl02@gmail.com" aria-label="Email">
            <Mail className="w-6 h-6 hover:text-primary transition" />
          </Link>
        </div>
      </div>
    </main>
  );
}
