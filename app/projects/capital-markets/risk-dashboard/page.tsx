"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function RiskDashboardPage() {
  const [tickers, setTickers] = useState<{ symbol: string; weight: string }[]>([]);
  const [currentTicker, setCurrentTicker] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightType, setWeightType] = useState<"percent" | "cad" | null>(null);
  const [yearsBack, setYearsBack] = useState<number | null>(null);
  const [benchmark, setBenchmark] = useState(true);

  const [showYearsSelect, setShowYearsSelect] = useState(false);
  const [outputData, setOutputData] = useState<any>(null);

  const totalPercent = tickers.reduce((sum, t) => sum + (parseFloat(t.weight) || 0), 0);
  const totalCAD = tickers.reduce((sum, t) => sum + (parseFloat(t.weight) || 0), 0);

  const addTicker = () => {
    const weightNum = parseFloat(currentWeight);
    if (!currentTicker || isNaN(weightNum)) return;
    if (weightType === "percent" && totalPercent + weightNum > 100) {
      alert("Total percentage allocation cannot exceed 100%.");
      return;
    }
    setTickers([...tickers, { symbol: currentTicker.toUpperCase(), weight: currentWeight }]);
    setCurrentTicker("");
    setCurrentWeight("");
    if (weightType && !yearsBack) setShowYearsSelect(true);
  };

  useEffect(() => {
    const fetchRiskMetrics = async () => {
      if (tickers.length === 0 || !yearsBack) return;

      const rawWeights = tickers.map((t) => parseFloat(t.weight));
      const normalizedWeights = weightType === "cad"
        ? rawWeights.map(w => w / totalCAD)
        : rawWeights.map(w => w / 100);

      const payload = {
        tickers: tickers.map((t) => t.symbol),
        weights: normalizedWeights,
        yearsBack,
        benchmark,
        interval: "1mo"
      };

      try {
        const res = await fetch("/api/risk-metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        // Calculate cumulative return percentage
        const cumulativeReturn = data.portfolioReturns.reduce((acc: number, r: number) => acc * (1 + r), 1) - 1;
        data.metrics.portfolioReturn = `${(cumulativeReturn * 100).toFixed(2)}%`;

        setOutputData(data);
      } catch (err) {
        console.error("Error fetching risk metrics:", err);
      }
    };

    fetchRiskMetrics();
  }, [tickers, yearsBack, benchmark]);

  const accumulateReturns = (returns: number[]) => {
    const growth = [1];
    for (let i = 0; i < returns.length; i++) {
      growth.push(growth[growth.length - 1] * (1 + returns[i]));
    }
    return growth.slice(1);
  };

  const renderChartData = () => {
    if (!outputData?.portfolioReturns || !outputData?.portfolioDates) return [];

    const portfolioGrowth = accumulateReturns(outputData.portfolioReturns);
    const benchmarkGrowth = benchmark && outputData.benchmarkReturns
      ? accumulateReturns(outputData.benchmarkReturns)
      : [];

    return outputData.portfolioDates.map((date: string, i: number) => ({
      date,
      portfolio: portfolioGrowth[i],
      ...(benchmarkGrowth.length > i ? { benchmark: benchmarkGrowth[i] } : {})
    }));
  };

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center">Live Market Risk Dashboard</h1>
      <p className="text-muted-foreground text-center mb-10 text-lg">
        Input your portfolio and view key risk metrics over time.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Ticker Symbol</label>
          <input
            type="text"
            value={currentTicker}
            onChange={(e) => setCurrentTicker(e.target.value)}
            placeholder="e.g. AAPL"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Weight ({weightType === "percent" ? "%" : weightType === "cad" ? "CAD" : "Select one"})
          </label>
          <input
            type="text"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder={weightType === "percent" ? "e.g. 25" : "e.g. 10000"}
            className="w-full px-4 py-2 border rounded"
            disabled={!weightType || (weightType === "percent" && totalPercent >= 100)}
          />
        </div>

        {!weightType && (
          <div className="flex gap-4">
            <button
              onClick={() => setWeightType("percent")}
              className="px-4 py-2 rounded border bg-gray-100 hover:bg-primary hover:text-white"
            >
              %
            </button>
            <button
              onClick={() => setWeightType("cad")}
              className="px-4 py-2 rounded border bg-gray-100 hover:bg-primary hover:text-white"
            >
              CAD
            </button>
          </div>
        )}

        <button
          onClick={addTicker}
          disabled={weightType === "percent" && totalPercent >= 100}
          className="w-full mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Add Ticker
        </button>

        <AnimatePresence>
          {tickers.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-2"
            >
              {tickers.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 dark:bg-zinc-800 p-3 rounded shadow-sm flex justify-between"
                >
                  <span>
                    {item.symbol} – {item.weight}
                    {weightType === "percent" ? "%" : " CAD"}
                  </span>
                </div>
              ))}
              {weightType === "percent" && (
                <div className="text-right text-sm text-muted-foreground">
                  Allocation: {totalPercent.toFixed(2)}% / 100%
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showYearsSelect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pt-6"
            >
              <label className="block mb-2 font-medium">How far back should we look?</label>
              <select
                className="w-full px-4 py-2 border rounded"
                value={yearsBack ?? undefined}
                onChange={(e) => setYearsBack(parseInt(e.target.value))}
              >
                <option value="">Select...</option>
                {[1, 3, 5, 10].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr} year{yr > 1 && "s"}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="benchmark"
                  checked={benchmark}
                  onChange={(e) => setBenchmark(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="benchmark" className="text-lg">
                  Compare to SPY (market benchmark)
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {outputData && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">📊 Risk Analysis Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(outputData.metrics || {}).map(([key, value]) => {
              if (key === "correlationMatrix") return null;
              return (
                <div
                  key={key}
                  className="p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 shadow-md hover:shadow-lg transition"
                >
                  <div className="text-sm text-muted-foreground font-medium capitalize">
                    {key === "portfolioReturn" ? "Portfolio Return" : key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </div>
                  <div className="text-xl font-bold mt-1">{String(value)}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4 text-center">📈 Portfolio Return</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={renderChartData()}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 'auto']} tickFormatter={(val) => `${(val * 100 - 100).toFixed(1)}%`} />
                <Tooltip
                  formatter={(val: number) => `${(val * 100 - 100).toFixed(2)}%`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line type="monotone" dataKey="portfolio" stroke="#8884d8" strokeWidth={2} dot={false} name="Portfolio" />
                {benchmark && outputData.benchmarkReturns && (
                  <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" strokeWidth={2} dot={false} name="Benchmark (SPY)" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-16 text-center">
        <Link
          href="/projects/capital-markets"
          className="inline-block px-8 py-3 text-lg bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          ← Back to Capital Markets
        </Link>
      </div>
    </main>
  );
}
