"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TenKAnalyzerPage() {
  const [ticker, setTicker] = useState("");
  const [year, setYear] = useState("2023");
  const [section, setSection] = useState("Overview");
  const [sectionText, setSectionText] = useState<string | null>(null);
  const [filingUrl, setFilingUrl] = useState<string | null>(null);

  const fetchFiling = async () => {
    try {
      const res = await fetch("/api/edgar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, year, section }),
      });

      const data = await res.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      setSectionText(data.sectionText);
      setFilingUrl(data.filingUrl);
    } catch (err) {
      console.error("Error fetching filing:", err);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">10-K Analyzer</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter Ticker (e.g. AAPL)"
          className="border px-4 py-2 rounded w-full"
        />
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        >
          {[2023, 2022, 2021, 2020].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        >
          {["overview", "risk factors", "financials", "all"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchFiling}
        className="mb-8 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Analyze Filing
      </button>

      {filingUrl && (
        <div className="mb-8 text-center">
          <a
            href={filingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Full 10-K Filing ↗
          </a>
        </div>
      )}

      {sectionText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-zinc-800 text-white p-6 rounded-lg shadow max-h-[600px] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-4">{section}</h2>
          <p className="text-sm text-muted mb-4">
            {section === "Overview" && "Company background, business model, and mission."}
            {section === "Risk Factors" && "Market, operational, legal, and compliance risks."}
            {section === "Financials" && "Key financial performance indicators and breakdowns."}
            {section === "All" && "Full summary of all business and compliance information."}
          </p>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{sectionText}</pre>
        </motion.div>
      )}

      <div className="mt-16 text-center">
        <Link
          href="/projects/corporate-finance"
          className="inline-block px-8 py-3 text-lg bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          ← Back to Corporate Finance
        </Link>
      </div>
    </main>
  );
}
