"use client";
import { useState } from "react";

export default function BacktestPage() {
  const [stock1, setStock1] = useState("");
  const [stock2, setStock2] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runBacktest() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/run-backtest", {
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
      <h1 className="text-4xl font-bold text-center mb-6">Pairs Trading Backtest</h1>

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
          onClick={runBacktest}
          disabled={loading}
        >
          {loading ? "Running Backtest..." : "Run Backtest"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">Backtest Results:</h2>
          <p><strong>Hedge Ratio:</strong> {result.hedge_ratio?.toFixed(4)}</p>
          <p><strong>Latest Z-Score:</strong> {result.zscore?.toFixed(4)}</p>
          {result.imageUrl && (
            <div className="mt-4">
              <img src={result.imageUrl} alt="Backtest Chart" className="rounded-lg shadow-lg"/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
