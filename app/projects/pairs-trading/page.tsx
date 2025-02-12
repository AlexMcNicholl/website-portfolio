"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PairsTradingProject() {
  const [assetClass, setAssetClass] = useState("Equities");
  const [subCategory, setSubCategory] = useState("-");
  const [universeSize, setUniverseSize] = useState("10");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Asset class options
  const assetOptions: Record<string, string[]> = {
    Equities: ["Tech", "Finance", "Energy", "Healthcare", "Pharmaceutical", "Utilities", "Industrials"],
    Commodities: [],
    "FX Rates": [],
  };

  // Universe size options
  const universeOptions = ["5", "10", "50", "100"];

  async function analyzePair() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/run-python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetClass, subCategory, universeSize }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error processing request.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">Pairs Trading Analysis</h1>

      {/* Asset Selection */}
      <div className="flex flex-col gap-4 mb-4 w-full max-w-md">
        <label className="font-semibold">Select Asset Class:</label>
        <select
          value={assetClass}
          onChange={(e) => {
            setAssetClass(e.target.value);
            setSubCategory("-"); // Reset category for Commodities/FX Rates
          }}
          className="border p-2 rounded text-black"
        >
          {Object.keys(assetOptions).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Subcategory Dropdown - Show only if Equities, otherwise "-" */}
        <label className="font-semibold">Select {assetClass} Category:</label>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="border p-2 rounded text-black"
          disabled={assetOptions[assetClass].length === 0} // Disable for Commodities/FX Rates
        >
          {assetOptions[assetClass].length > 0 ? (
            <>
              <option value="-">Select Category</option>
              {assetOptions[assetClass].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </>
          ) : (
            <option value="-">-</option>
          )}
        </select>

        {/* Universe Size Dropdown - Disabled if Commodities/FX Rates */}
        <label className="font-semibold">Select Universe Size:</label>
        <select
          value={universeSize}
          onChange={(e) => setUniverseSize(e.target.value)}
          className="border p-2 rounded text-black"
          disabled={assetOptions[assetClass].length === 0} // Disable for Commodities/FX Rates
        >
          {assetOptions[assetClass].length > 0 ? (
            universeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))
          ) : (
            <option value="-">-</option>
          )}
        </select>
      </div>

      {/* Analyze Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={analyzePair}
        disabled={loading || !subCategory || subCategory === "-"}
      >
        {loading ? "Analyzing..." : "Analyze Pairs"}
      </button>

      {/* Error Handling */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display Results */}
      {result && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">Results:</h2>
          <p><strong>Cointegration Test (p-value):</strong> {result.p_value.toFixed(4)}</p>
          <p><strong>Optimal Pairs Found:</strong> {result.optimal_pairs.join(", ")}</p>
          {result.p_value < 0.05 ? (
            <p className="text-green-500 font-bold">✅ Statistically Significant Pairs</p>
          ) : (
            <p className="text-red-500 font-bold">❌ No Significant Pairs</p>
          )}
        </div>
      )}

      {/* 🚀 Perform Trading & Backtest Button */}
      {result && (
        <button
          className="px-4 py-2 mt-6 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => router.push(`/projects/pairs-trading/backtest?assetClass=${assetClass}&subCategory=${subCategory}&universeSize=${universeSize}`)}
        >
          🚀 Perform Trading and Backtest
        </button>
      )}

      {/* 🔙 Return to Home Button */}
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          🔙 Return to Home
        </button>
      </Link>
    </div>
  );
}
