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
    setResult(null);

    try {
      const response = await fetch("/api/pairs-trading/route", {
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
        disabled={loading || subCategory === "-"}
      >
        {loading ? "Analyzing..." : "Analyze Pairs"}
      </button>

      {/* Error Handling */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display Results */}
      {result && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">Results:</h2>

          {/* Best Pair Display */}
          <p className="font-bold text-lg">
            🔥 Best Pair: {result.best_pair ? `${result.best_pair[0]} & ${result.best_pair[1]}` : "N/A"}
          </p>

          {/* Results Table */}
          <table className="mt-4 border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Stock 1</th>
                <th className="border p-2">Stock 2</th>
                <th className="border p-2">Corr</th>
                <th className="border p-2">P-Value</th>
                <th className="border p-2">ADF 1</th>
                <th className="border p-2">ADF 2</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((pair: any, index: number) => (
                <tr key={index} className="border">
                  <td className="border p-2">{pair.stock1}</td>
                  <td className="border p-2">{pair.stock2}</td>
                  <td className="border p-2">{pair.correlation.toFixed(2)}</td>
                  <td className="border p-2">{pair.p_value.toFixed(4)}</td>
                  <td className="border p-2">{pair.adf_stock1.toFixed(4)}</td>
                  <td className="border p-2">{pair.adf_stock2.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
