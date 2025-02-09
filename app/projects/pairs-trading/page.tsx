import React from "react";

export default function PairsTradingProject() {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-center mb-6">Pairs Trading Algorithm</h1>
        <p className="max-w-2xl text-lg text-center text-gray-400">
          This project is a statistical arbitrage trading algorithm that identifies pairs of assets with correlated 
          price movements and executes **automated trades** when they diverge.
        </p>
  
        {/* Project Details */}
        <div className="max-w-3xl mt-8 space-y-4">
          <p>
            🔹 **Built with:** Python, NumPy, Pandas, SciPy, SQL, and API integration  
        <br>🔹 **Features:** Mean reversion detection, real-time market execution, backtesting framework </br>
        <br>🔹 **Data Sources:** IBKR API, Yahoo Finance  </br>
          </p>
           
            
  
          {/* Link to GitHub */}
          <a
            href="https://github.com/PugNation/TradingAlgo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-lg"
          >
            🔗 View on GitHub
          </a>
        </div>
  
        {/* Back Button */}
        <div className="mt-10">
          <a href="/" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
            ⬅ Back to Home
          </a>
        </div>
      </div>
    );
  }
  
