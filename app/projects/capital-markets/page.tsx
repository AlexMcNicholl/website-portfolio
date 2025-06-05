"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function ProjectCard({ title, description, image, slug, github, tags }: any) {
  return (
    <Link href={`/projects/capital-markets/${slug}`} className="block h-full">
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="h-full border rounded-xl shadow-md hover:shadow-xl transition duration-300 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col"
      >
        <Image
          src={image}
          alt={title}
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3 flex-grow">{description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mt-auto text-sm">
            <span className="text-primary font-medium">View Project →</span>
            <a
              href={github}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function CapitalMarketsPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Capital Markets Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <ProjectCard
          title="Live Market Risk Dashboard"
          description="Real-time risk metrics for portfolios using VaR, CVaR, volatility, and correlation analysis."
          image="/risk-dashboard.jpg"
          slug="risk-dashboard"
          github="https://github.com/AlexMcNicholl" // Replace with actual repo link
          tags={["Python", "Streamlit", "yfinance"]}
        />
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/projects"
          className="inline-block px-8 py-3 text-lg bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          ← Back to All Domains
        </Link>
      </div>
    </main>
  );
}
