"use client"; // Ensure it's a Client Component

import Link from "next/link";
import { useState, useEffect } from "react";

export default function PairsTradingPage() {
  // State for dropdown selections
  const [assetClass, setAssetClass] = useState("");
  const [numPairs, setNumPairs] = useState("");
  const [industry, setIndustry] = useState("");

  // Fetch user selections from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAssetClass = localStorage.getItem("assetClass") || "";
      const storedNumPairs = localStorage.getItem("numPairs") || "";
      const storedIndustry = localStorage.getItem("industry") || "";

      setAssetClass(storedAssetClass);
      setNumPairs(storedNumPairs);
      setIndustry(storedIndustry);
    }
  }, []);

  // Save user choices to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("assetClass", assetClass);
      localStorage.setItem("numPairs", numPairs);
      localStorage.setItem("industry", industry);
    }
  }, [assetClass, numPairs, industry]);

  // Check if all fields are filled
  const isAnalyzeDisabled = !assetClass || !numPairs || (assetClass === "equities" && !industry);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      {/* Updated Title */}
      <h1 className="text-4xl font-bold mb-4">Pairs Trading Algorithm</h1>

      <p className="max-w-2xl text-lg text-center text-gray-400">
        A statistical arbitrage trading algorithm that identifies and trades pairs of assets.
      </p>

      {/* Dropdown Section */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        {/* Asset Class Dropdown */}
        <div className="dropdown">
          <label htmlFor="asset-class" className="block text-lg font-semibold mb-2">
            Asset Class:
          </label>
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
          <label htmlFor="num-pairs" className="block text-lg font-semibold mb-2">
            Number of Pairs:
          </label>
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
            <label htmlFor="industry" className="block text-lg font-semibold mb-2">
              Industry:
            </label>
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

      {/* Analyze Button */}
      <div className="mt-6">
        <Link
          href="/projects/pairs-trading/analyze"
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isAnalyzeDisabled
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={(e) => {
            if (isAnalyzeDisabled) e.preventDefault(); // Prevent navigation if disabled
          }}
        >
          Analyze
        </Link>
      </div>

      {/* GitHub Link */}
      <div className="mt-6">
        <Link
          href="https://github.com/AlexMcNicholl/TradingAlgo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-lg"
        >
          🔗 View on GitHub
        </Link>
      </div>

      {/* Back to Home */}
      <div className="mt-6">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}