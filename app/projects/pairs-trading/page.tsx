"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PairsTradingProject() {
  const [stock1, setStock1] = useState("");
  const [stock2, setStock2] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter(); // ✅ Router to navigate to backtesting page

  async function analyzePair() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/run-python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock1, stock2 }),
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

      {/* Stock Input Fields */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter first stock (e.g., AAPL)"
          className="border p-2 rounded"
          value={stock1}
          onChange={(e) => setStock1(e.target.value.toUpperCase())}
        />
        <input
          type="text"
          placeholder="Enter second stock (e.g., MSFT)"
          className="border p-2 rounded"
          value={stock2}
          onChange={(e) => setStock2(e.target.value.toUpperCase())}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={analyzePair}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Pair"}
        </button>
      </div>

      {/* Display Errors if Any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Results */}
      {result && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">Results:</h2>
          <p><strong>Cointegration Test (p-value):</strong> {result.p_value.toFixed(4)}</p>
          <p><strong>ADF Test (Stock 1):</strong> {result.adf_stock1.toFixed(4)}</p>
          <p><strong>ADF Test (Stock 2):</strong> {result.adf_stock2.toFixed(4)}</p>
          {result.p_value < 0.05 ? (
            <p className="text-green-500 font-bold">✅ Statistically Significant Pair</p>
          ) : (
            <p className="text-red-500 font-bold">❌ Not a Significant Pair</p>
          )}
        </div>
      )}

      {/* 🚀 Perform Trading & Backtest Button */}
      {result && (
        <button
          className="px-4 py-2 mt-6 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => router.push(`/projects/pairs-trading/backtest?stock1=${stock1}&stock2=${stock2}`)}
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
