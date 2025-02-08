"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const StockTable = ({ symbol }: { symbol: string }) => {
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStockInfo = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`/api/stocks/info?symbol=${symbol}`);
        setStockInfo(response.data);
      } catch (err) {
        setError("Failed to fetch stock details.");
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockInfo();
    }
  }, [symbol]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">{symbol} Stock Information</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Current Price:</td>
              <td className="border px-4 py-2">${stockInfo.currentPrice}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Market Cap:</td>
              <td className="border px-4 py-2">${stockInfo.marketCap}B</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Volume:</td>
              <td className="border px-4 py-2">{stockInfo.volume}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">P/E Ratio:</td>
              <td className="border px-4 py-2">{stockInfo.peRatio}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">52-Week High:</td>
              <td className="border px-4 py-2">${stockInfo.high52Week}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">52-Week Low:</td>
              <td className="border px-4 py-2">${stockInfo.low52Week}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockTable;
