"use client";
import { useState } from "react";
import Link from "next/link";

export default function FinancialDataVisualization() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/get-financial-data");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data.");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">Financial Data Visualization</h1>

      {/* Fetch Data Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Financial Data"}
      </button>

      {/* Error Handling */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Data Display */}
      {data && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">Data Overview:</h2>
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
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
