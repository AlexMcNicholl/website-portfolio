"use client";

import React, { useState } from "react";
import StockChart from "./stockchart";
import StockTable from "./stocktable"; // Ensure proper import

const FinancialVisualization = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [searchSymbol, setSearchSymbol] = useState("AAPL"); // ✅ Ensure it's defined

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchSymbol(symbol); // ✅ Updates only when Enter is pressed
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Financial Data Visualization</h1>
      <p className="text-gray-600 mb-4">Enter a stock ticker to view its price trends.</p>

      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        onKeyDown={handleKeyDown} // ✅ Ensures Enter key triggers search
        className="border p-2 w-full rounded-md mb-4"
        placeholder="Enter stock ticker (e.g., AAPL, TSLA, MSFT)"
      />

      <StockChart symbol={searchSymbol} /> {/* ✅ Uses updated stock symbol */}
      <StockTable symbol={searchSymbol} /> {/* ✅ Displays stock info */}
    </div>
  );
};

export default FinancialVisualization;
