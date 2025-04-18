"use client"; // Ensure it's a Client Component

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import projectsData from "@/data/projects"; // Import the projects data

export default function ProjectPage() {
  const params = useParams(); // Get URL params
  const slug = params?.slug as string; // Get the project slug from the URL

  const project = projectsData.find((p) => p.slug === slug);

  // State for dropdown selections
  const [assetClass, setAssetClass] = useState("");
  const [numPairs, setNumPairs] = useState("");
  const [industry, setIndustry] = useState("");

  if (!project) {
    return <div className="text-center text-red-500 text-xl font-semibold">Project not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

      <p className="max-w-2xl text-lg text-center text-gray-400">{project.description}</p>

      {/* Dropdown Section */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        {/* Asset Class Dropdown */}
        <div className="dropdown">
          <label htmlFor="asset-class" className="block text-lg font-semibold mb-2">Asset Class:</label>
          <select
            id="asset-class"
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value)}
            className="p-2 border rounded-lg bg-white text-black"
          >
            <option value="">Select Asset Class</option>
            <option value="equities">Equities</option>
            <option value="commodities">Commodities</option>
            <option value="fx">FX</option>
            <option value="crypto">CryptoCurrencies</option>
          </select>
        </div>

        {/* Number of Pairs Dropdown */}
        <div className="dropdown">
          <label htmlFor="num-pairs" className="block text-lg font-semibold mb-2">Number of Pairs:</label>
          <select
            id="num-pairs"
            value={numPairs}
            onChange={(e) => setNumPairs(e.target.value)}
            className="p-2 border rounded-lg bg-white text-black"
          >
            <option value="">Select Number of Pairs</option>
            <option value="2">2</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Industry Dropdown (Conditional) */}
        {assetClass === "equities" && (
          <div className="dropdown">
            <label htmlFor="industry" className="block text-lg font-semibold mb-2">Industry:</label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="p-2 border rounded-lg bg-white text-black"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="energy">Energy</option>
              <option value="consumer-goods">Consumer Goods</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-lg">
          🔗 View on GitHub
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}