"use client";
import { useState } from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { erf } from "mathjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BlackScholesModel() {
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [timeToMaturity, setTimeToMaturity] = useState(1);
  const [volatility, setVolatility] = useState(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState(0.05);

  const blackScholesFormula = `C = S * N(d1) - X * e^(-rT) * N(d2)`;

  function calculateOptionPrice() {
    const d1 =
      (Math.log(stockPrice / strikePrice) +
        (riskFreeRate + (volatility ** 2) / 2) * timeToMaturity) /
      (volatility * Math.sqrt(timeToMaturity));
    const d2 = d1 - volatility * Math.sqrt(timeToMaturity);

    const N = (x: number) => {
      return (1 + erf(x / Math.sqrt(2))) / 2; // Cumulative distribution function for normal distribution
    };

    const callPrice =
      stockPrice * N(d1) -
      strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * N(d2);

    return callPrice;
  }

  const optionPrice = calculateOptionPrice();

  const chartData = {
    labels: Array.from({ length: 100 }, (_, i) => i + 50),
    datasets: [
      {
        label: "Call Option Price",
        data: Array.from({ length: 100 }, (_, i) => {
          const S = i + 50;
          const d1 =
            (Math.log(S / strikePrice) +
              (riskFreeRate + (volatility ** 2) / 2) * timeToMaturity) /
            (volatility * Math.sqrt(timeToMaturity));
          const d2 = d1 - volatility * Math.sqrt(timeToMaturity);
          const N = (x: number) => (1 + erf(x / Math.sqrt(2))) / 2;
          const intrinsicValue = S * N(d1) -
            strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * N(d2);
          return intrinsicValue - optionPrice; // Adjusted to start at negative cost
        }),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
      },
      {
        label: "Zero Line",
        data: Array(100).fill(0), // Horizontal line at y=0
        borderColor: "#FF0000",
        borderWidth: 1,
        borderDash: [5, 5], // Dashed line
        pointRadius: 0, // No points
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Stock Price (S)",
          color: "#FFFFFF",
        },
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Option Price ($)",
          color: "#FFFFFF",
        },
        ticks: {
          color: "#FFFFFF",
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return `$${value}`;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      {/* Banner */}
      <h1 className="text-4xl font-bold text-center mb-6">Black-Scholes Option Pricing Model</h1>

      {/* Formula Display */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold">{blackScholesFormula}</p>
      </div>

      {/* Sliders for Input Values */}
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium">Stock Price (S): {stockPrice}</label>
          <input
            type="range"
            min="50"
            max="200"
            value={stockPrice}
            onChange={(e) => setStockPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Strike Price (X): {strikePrice}</label>
          <input
            type="range"
            min="50"
            max="200"
            value={strikePrice}
            onChange={(e) => setStrikePrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Time to Maturity (T): {timeToMaturity}</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={timeToMaturity}
            onChange={(e) => setTimeToMaturity(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Volatility (σ): {volatility}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={volatility}
            onChange={(e) => setVolatility(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Risk-Free Rate (r): {riskFreeRate}</label>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.01"
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Option Price Calculation */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold">Option Price: ${optionPrice.toFixed(2)}</h2>
      </div>

      {/* Graph of Call Option */}
      <div className="mt-6 w-full max-w-2xl">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Return to Home Button */}
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          🔙 Return to Home
        </button>
      </Link>
    </div>
  );
}
