"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PairsTradingResults() {
  // Get URL search parameters
  const searchParams = useSearchParams();
  // Safely retrieve stock tickers (or use empty strings if not present)
  const stock1 = searchParams?.get("stock1") || "";
  const stock2 = searchParams?.get("stock2") || "";

  // State to hold the backtest data, loading status, and errors
  const [backtestData, setBacktestData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchBacktest() {
      try {
        const response = await fetch(
          `/api/backtest?stock1=${encodeURIComponent(stock1)}&stock2=${encodeURIComponent(stock2)}`
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Error fetching backtest data.");
        } else {
          setBacktestData(data);
        }
      } catch (err) {
        console.error("Error fetching backtest data:", err);
        setError("Error fetching backtest data.");
      } finally {
        setLoading(false);
      }
    }

    if (stock1 && stock2) {
      fetchBacktest();
    } else {
      setLoading(false);
    }
  }, [stock1, stock2]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">Backtest Results</h1>
      <p className="text-lg text-center text-gray-400">
        Reviewing past performance of {stock1} and {stock2} using a pairs trading strategy.
      </p>

      {loading ? (
        <p className="mt-6 text-blue-400">⏳ Loading backtest results...</p>
      ) : error ? (
        <p className="mt-6 text-red-400">{error}</p>
      ) : (
        <div className="mt-6 bg-gray-800 p-4 rounded-md max-w-2xl text-white">
          <h2 className="text-xl font-semibold">Performance Metrics:</h2>
          {backtestData ? (
            <pre className="whitespace-pre-wrap">{JSON.stringify(backtestData, null, 2)}</pre>
          ) : (
            <p className="text-red-400">❌ No backtest data available.</p>
          )}
        </div>
      )}

      <div className="mt-10">
        <a
          href="/projects/pairs-trading"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
        >
          ⬅ Back to Analysis
        </a>
      </div>
    </div>
  );
}
