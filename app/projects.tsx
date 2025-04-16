"use client";

import Link from "next/link";

function ProjectCard({ title, description, image, slug, github, tags }: any) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
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
    <main className="min-h-screen bg-background text-foreground px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          title="Pairs Trading Algorithm"
          description="Programmatic Trading with Statistical Arbitrage."
          image="/9.webp?height=400&width=600"
          slug="pairs-trading"
          github="https://github.com/AlexMcNicholl/TradingAlgo"
          tags={["Python Libraries", "SQL", "API Integration"]}
        />
        <ProjectCard
          title="Financial Data Visualization"
          description="Real-time stock charts with interactive analysis."
          image="/portfolio.jpg?height=400&width=600"
          slug="financial-visualization"
          github="https://github.com/AlexMcNicholl/TradingAlgo"
          tags={["Next.js", "Recharts", "API Integration"]}
        />
      </div>
    </main>
  );
}