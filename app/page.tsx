import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import ContactForm from "./components/contact-form";
import ProjectCard from "./components/project-card";
import TechStack from "./components/tech-stack";
import { Button } from "./components/ui/button"; // Ensure this matches your structure
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-6">
            <Link href="/"
              className="flex items-center space-x-2 font-bold text-lg">
                <span>Alex McNicholl</span>
             
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="#about">About</Link>
              <Link href="#projects">Projects</Link>
              <Link href="#contact">Contact</Link>
            </nav>
          </div>
          <Link href="/AlexMcNicholl_CV.pdf" target="_blank">
              <Button variant="outline" className="ml-auto">
           Resume
              </Button>
            </Link>


        </div>
      </header>

      {/* Main Content */}
      <main className="container flex flex-col items-center justify-center px-4 md:px-6 text-center space-y-12">
        
        {/* About Section */}
        <section id="about" className="w-full flex flex-col items-center py-24">
          <h1 className="text-5xl font-bold">FinTech Enthusiast</h1>
          <p className="max-w-lg text-gray-500 md:text-xl dark:text-gray-400">
            Building different products for my enjoyment
            <br />This site is a constant work in progress
          </p>
          <div className="flex space-x-4 mt-6">
            <Link href="https://github.com/AlexMcNicholl" target="_blank">
              
                <Button variant="outline" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              
            </Link>
            <Link href="https://www.linkedin.com/in/amcnicholl/" target="_blank">
              
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
              
            </Link>
            <Link href="https://twitter.com" target="_blank">
              
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
              
            </Link>
            <Link href="mailto:amcnicholl02@gmail.com">
              
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              
            </Link>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="w-full py-24">
          <h2 className="text-4xl font-bold mb-8">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="Pairs Trading Algorithm"
              description="Programmatic Trading with Statistical Arbitrage."
              image="/9.webp?height=400&width=600"
              link="/projects/pairs-trading"
              tags={["Python Libraries", "SQL", "API Integration"]}
            />
            <ProjectCard
              title="Financial Data Visualization"
              description="Real-time stock charts with interactive analysis."
              image="/portfolio.jpg?height=400&width=600"
              link="/projects/financial-visualization"
              tags={["Next.js", "Recharts", "API Integration"]}
            />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="w-full py-24">
          <h2 className="text-4xl font-bold mb-8">Tech Stack</h2>
          <TechStack />
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-24 flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
          <div className="w-full max-w-2xl">
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t w-full py-6 flex flex-col items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Alex McNicholl. All rights reserved.
        </p>
        <nav className="flex space-x-4 mt-2">
          <Link href="#">Thank you for visiting</Link>
        </nav>
      </footer>
    </div>
  );
}
