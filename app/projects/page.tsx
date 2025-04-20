"use client";

import Link from "next/link";

function ProjectCard({ title, description, image, slug, github, tags }: any) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      {/* Make the image clickable */}
      <Link href={`/projects/${slug}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`/projects/${slug}`}
            className="text-primary hover:underline text-sm"
          >
            View Details
          </Link>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold text-center mb-8">My Projects</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Project 1: Pairs Trading Algorithm */}
          <ProjectCard
            title="Pairs Trading Algorithm"
            description="Programmatic Trading with Statistical Arbitrage."
            image="/9.webp?height=400&width=600"
            slug="pairs-trading"
            github="https://github.com/AlexMcNicholl/Trading"
            tags={["Python Libraries", "SQL", "API Integration"]}
          />

          {/* Project 2: Black-Scholes Option Pricing Model */}
          <ProjectCard
            title="Black-Scholes Option Pricing Model"
            description="Option Pricing with the Black-Scholes Model."
            image="/options.png?height=400&width=600"
            slug="options-model"
            github="https://github.com/AlexMcNicholl"
            tags={["Next.js", "Recharts", "API Integration"]}
          />

          {/* Project 3: Monte Carlo Sim */}
          <ProjectCard
            title="Monte Carlo Retirement Simulator"
            description="Monte Carlo Analysis for retirement savings and withdrawals to estimate potential financial outcomes."
            image="/retirement.jpg"
            slug="retirement-sim"
            github="https://github.com/AlexMcNicholl"
            
          />
        </div>
      </div>

      {/* Disclaimer and Return Button */}
      <div className="mt-16 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          Disclaimer: All projects are a work in progress.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-8 py-3 text-lg bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}