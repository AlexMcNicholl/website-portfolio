"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Quant",
    slug: "quant",
    emoji: "📈",
    description: "Projects focused on financial modeling, algorithmic trading, and quantitative analysis.",
    bg: "from-purple-500 to-indigo-600",
  },
  {
    title: "Capital Markets",
    slug: "capital-markets",
    emoji: "💹",
    description: "Tools and dashboards related to market risk, portfolio metrics, and asset analytics.",
    bg: "from-green-500 to-emerald-600",
  },
  {
    title: "Corporate Finance",
    slug: "corporate-finance",
    emoji: "🏦",
    description: "Applications for capital structure analysis, valuation, and financial planning.",
    bg: "from-yellow-500 to-orange-500",
  },
];


export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-20 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center mb-14">Explore My Project Domains</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/projects/${cat.slug}`} className="h-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`h-full flex flex-col justify-between rounded-2xl text-white p-8 shadow-xl bg-gradient-to-br ${cat.bg} transition-transform duration-300 cursor-pointer`}
            >
              <div>
                <div className="text-5xl mb-4">{cat.emoji}</div>
                <h2 className="text-2xl font-semibold mb-2">{cat.title}</h2>
                <p className="text-white/90">{cat.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="text-muted-foreground font-medium text-lg mb-4">
          Each category contains job-relevant, interactive tools and dashboards.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 text-lg bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
