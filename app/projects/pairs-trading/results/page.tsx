"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PairsTradingResults() {
  // Extract stock tickers from URL parameters
  const searchParams = useSearchParams();
  const stock1 = searchParams?.get("stock1") || "";
  const stock2 = searchParams?.get("stock2") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backtestResults, setBacktestResults] = useState<any>(null);
  const [graphUrls, setGraphUrls] = useState<{ strategy: string; backtest: string }>({
    strategy: "",
    backtest: "",
  });

  useEffect(() => {
    if (!stock1 || !stock2) {
      setError("Invalid stock tickers provided.");
      setLoading(false);
      return;
    }

    async function fetchBacktestResults() {
      try {
        const response = await fetch(
          `/api/backtest?stock1=${encodeURIComponent(stock1)}&stock2=${encodeURIComponent(stock2)}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error fetching backtest data.");
        } else {
          setBacktestResults(data.results);
          setGraphUrls({ strategy: data.strategy_graph, backtest: data.backtest_graph });
        }
      } catch (err) {
        console.error("Error fetching backtest results:", err);
        setError("Failed to fetch backtest results.");
      } finally {
        setLoading(false);
      }
    }

    fetchBacktestResults();
  }, [stock1, stock2]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">Pairs Trading Strategy & Backtest Results</h1>
      <p className="text-lg text-center text-gray-400">
        Reviewing the strategy and historical performance for <strong>{stock1}</strong> and <strong>{stock2}</strong>.
      </p>

      {loading ? (
        <p className="mt-6 text-blue-400">⏳ Loading backtest results...</p>
      ) : error ? (
        <p className="mt-6 text-red-400">❌ {error}</p>
      ) : (
        <>
          {/* Display Strategy Graph */}
          {graphUrls.strategy && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Trading Strategy Signals</h2>
              <img src={graphUrls.strategy} alt="Pairs Trading Strategy Graph" className="mt-2 rounded-lg shadow-lg" />
            </div>
          )}

          {/* Display Backtest Graph */}
          {graphUrls.backtest && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Backtest Performance</h2>
              <img src={graphUrls.backtest} alt="Backtest Performance Graph" className="mt-2 rounded-lg shadow-lg" />
            </div>
          )}

          {/* Display Performance Metrics */}
          {backtestResults && (
            <div className="mt-6 bg-gray-800 p-4 rounded-md max-w-2xl text-white">
              <h2 className="text-xl font-semibold">Performance Metrics:</h2>
              <pre className="whitespace-pre-wrap">{JSON.stringify(backtestResults, null, 2)}</pre>
            </div>
          )}
        </>
      )}

      {/* Back Button */}
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
