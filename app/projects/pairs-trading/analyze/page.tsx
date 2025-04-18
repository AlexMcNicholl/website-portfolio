"use client"; // Ensure it's a Client Component

import { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation"; // Import annotation plugin
import yahooFinance from "yahoo-finance2";
import { URLSearchParams } from "url";
import 'chartjs-adapter-date-fns'; // For date formatting on the x-axis

global.URLSearchParams = URLSearchParams as unknown as {
  new (init?: string | URLSearchParams | string[][] | Record<string, string> | undefined): URLSearchParams;
  prototype: URLSearchParams;
};

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, annotationPlugin);

export default function AnalyzePage() {
  const [assetClass, setAssetClass] = useState("");
  const [industry, setIndustry] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);
  const [timeSeriesGraphData, setTimeSeriesGraphData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; fill: boolean }[];
  } | null>(null);
  const [spreadGraphData, setSpreadGraphData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; fill: boolean }[];
    annotations?: Record<string, any>;
    signal?: { arrow: string; text: string } | null;
  } | null>(null);
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [adfTest, setAdfTest] = useState<number | null>(null);
  const [cointegration, setCointegration] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAssetClass = localStorage.getItem("assetClass") || "";
      const storedIndustry = localStorage.getItem("industry") || "";

      setAssetClass(storedAssetClass);
      setIndustry(storedIndustry);
    }
  }, []);

  const fetchRandomTickers = async () => {
    try {
      const tickersByAssetClass = {
        equities: {
          technology: ["AAPL", "MSFT", "GOOGL", "AMZN", "META"],
          finance: ["JPM", "BAC", "C", "GS", "MS"],
          healthcare: ["JNJ", "PFE", "MRK", "ABBV", "TMO"],
          energy: ["XOM", "CVX", "COP", "SLB", "PSX"],
          "consumer-goods": ["PG", "KO", "PEP", "UL", "CL"],
        },
        commodities: ["GC=F", "CL=F", "SI=F", "HG=F", "NG=F"],
        fx: ["EURUSD=X", "JPY=X", "GBPUSD=X", "AUDUSD=X", "USDCAD=X"],
        crypto: ["BTC-USD", "ETH-USD", "BNB-USD", "XRP-USD", "ADA-USD"],
      };

      let availableTickers: string[] = [];

      if (assetClass === "equities" && industry) {
        availableTickers = tickersByAssetClass.equities[industry as keyof typeof tickersByAssetClass.equities] || [];
      } else {
        const result = tickersByAssetClass[assetClass as keyof typeof tickersByAssetClass];
        availableTickers = Array.isArray(result) ? result : [];
      }

      const selectedTickers = availableTickers.sort(() => 0.5 - Math.random()).slice(0, 2);
      setTickers(selectedTickers);
    } catch (error) {
      console.error("Error fetching tickers:", error);
      setTickers(["AAPL", "MSFT"]);
    }
  };

  const performAnalysis = async () => {
    try {
      if (tickers.length < 2) {
        console.error("Not enough tickers to perform analysis.");
        return;
      }

      const period1 = "2022-01-01";
      const period2 = "2023-01-01";

      const response = await fetch(
        `/api/fetchHistoricalData?tickers=${tickers.join(",")}&period1=${period1}&period2=${period2}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch historical data.");
      }

      const { historicalData } = await response.json();

      const closingPrices1 = historicalData[0].quotes.map((d: { date: string; close: number }) => d.close);
      const closingPrices2 = historicalData[1].quotes.map((d: { date: string; close: number }) => d.close);
      const labels = historicalData[0].quotes.map((d: { date: string; close: number }) => new Date(d.date).toISOString());

      // Calculate the spread
      const spread = closingPrices1.map((price: number, index: number) => price - closingPrices2[index]);

      // Calculate the z-score of the spread
      const meanSpread = spread.reduce((sum: number, val: number) => sum + val, 0) / spread.length;
      const stdDevSpread = Math.sqrt(
        spread.reduce((sum: number, val: number) => sum + (val - meanSpread) ** 2, 0) / spread.length
      );
      const zScore = spread.map((val: number) => (val - meanSpread) / stdDevSpread);

      // Determine the most recent signal
      const lastZScore = zScore[zScore.length - 1];
      const signal = lastZScore > 1.5 ? { arrow: "↑", text: "Sell Signal" } : lastZScore < -1.5 ? { arrow: "↓", text: "Buy Signal" } : null;

      // Identify high and low points for arrows with spacing threshold
      const spacingThreshold = 5; // Minimum spacing between arrows
      let lastArrowIndex = -spacingThreshold; // Track the last arrow's index
      const annotations = zScore.reduce((acc: Record<string, any>, value: number, index: number) => {
        if (index - lastArrowIndex >= spacingThreshold) {
          if (value > 1.5) {
            acc[`highPoint${index}`] = {
              type: "label",
              xValue: labels[index],
              yValue: value,
              backgroundColor: "rgba(0, 255, 0, 0.5)",
              content: "↑",
              color: "white",
              font: {
                size: 8, // Smaller arrow size
              },
            };
            lastArrowIndex = index;
          } else if (value < -1.5) {
            acc[`lowPoint${index}`] = {
              type: "label",
              xValue: labels[index],
              yValue: value,
              backgroundColor: "rgba(255, 0, 0, 0.5)",
              content: "↓",
              color: "white",
              font: {
                size: 8, // Smaller arrow size
              },
            };
            lastArrowIndex = index;
          }
        }
        return acc;
      }, {});

      // Update time series graph data
      setTimeSeriesGraphData({
        labels,
        datasets: [
          {
            label: tickers[0],
            data: closingPrices1,
            borderColor: "rgba(255, 99, 132, 1)",
            fill: false,
          },
          {
            label: tickers[1],
            data: closingPrices2,
            borderColor: "rgba(54, 162, 235, 1)",
            fill: false,
          },
        ],
      });

      // Update spread graph data with z-score and annotations
      setSpreadGraphData({
        labels,
        datasets: [
          {
            label: "Z-Score of Spread",
            data: zScore,
            borderColor: "rgba(255, 159, 64, 1)",
            fill: false,
          },
        ],
        annotations: {
          ...annotations,
          meanLine: {
            type: "line",
            yMin: 0, // Mean of z-score is always 0
            yMax: 0,
            borderColor: "rgba(200, 200, 200, 0.8)", // Neutral light gray color
            borderWidth: 2,
            label: {
              display: true,
              content: "Mean",
            },
          },
          upperBound: {
            type: "line",
            yMin: 1.5,
            yMax: 1.5,
            borderColor: "rgba(200, 200, 200, 0.8)", // Neutral light gray color
            borderWidth: 2,
            label: {
              display: true,
              content: "+1.5 Std Dev",
            },
          },
          lowerBound: {
            type: "line",
            yMin: -1.5,
            yMax: -1.5,
            borderColor: "rgba(200, 200, 200, 0.8)", // Neutral light gray color
            borderWidth: 2,
            label: {
              display: true,
              content: "-1.5 Std Dev",
            },
          },
        },
        signal, // Add the signal to the spread graph data
      });
    } catch (error) {
      console.error("Error performing analysis:", error);
    }
  };

  useEffect(() => {
    if (assetClass) {
      fetchRandomTickers();
    }
  }, [assetClass, industry]);

  useEffect(() => {
    if (tickers.length >= 2) {
      performAnalysis();
    }
  }, [tickers]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">Analyzing Pair</h1>

      <p className="max-w-2xl text-lg text-center text-gray-400 mb-6">
        Results of Analysis
      </p>

      {tickers.length === 2 && (
        <div className="mb-4">
          <p className="text-lg font-semibold flex items-center">
            <span
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "rgba(255, 99, 132, 1)" }}
            ></span>
            Ticker 1: {tickers[0]}
          </p>
          <p className="text-lg font-semibold flex items-center">
            <span
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "rgba(54, 162, 235, 1)" }}
            ></span>
            Ticker 2: {tickers[1]}
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {timeSeriesGraphData && (
          <div className="w-full max-w-lg border border-gray-300 rounded-lg p-4 bg-black">
            <h2 className="text-xl font-bold mb-2 text-center text-white">Asset Prices</h2>
            <Line
              data={timeSeriesGraphData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `$${value}`,
                      color: "white",
                    },
                    grid: {
                      color: "rgba(255, 255, 255, 0.2)",
                    },
                  },
                  x: {
                    type: "time",
                    time: {
                      unit: "month",
                    },
                    ticks: {
                      color: "white",
                    },
                    grid: {
                      color: "rgba(255, 255, 255, 0.2)",
                    },
                  },
                },
              }}
            />
          </div>
        )}

        {spreadGraphData && (
          <div className="w-full max-w-lg border border-gray-300 rounded-lg p-4 bg-black relative">
            <h2 className="text-xl font-bold mb-2 text-center text-white">Spread of Assets</h2>
            <Line
              data={spreadGraphData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "white",
                    },
                  },
                  annotation: {
                    annotations: spreadGraphData?.annotations || {}, // Include annotations for arrows and lines
                  },
                  tooltip: {
                    callbacks: {
                      afterBody: () => {
                        if (spreadGraphData?.signal) {
                          return `${spreadGraphData.signal.arrow} ${spreadGraphData.signal.text}`;
                        }
                        return "";
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => typeof value === "number" ? value.toFixed(2) : value,
                      color: "white",
                    },
                    suggestedMin: -2,
                    suggestedMax: 2,
                    grid: {
                      color: "rgba(255, 255, 255, 0.2)",
                    },
                  },
                  x: {
                    type: "time",
                    time: {
                      unit: "month",
                      displayFormats: {
                        month: "MMM d", // Show only month and day
                      },
                    },
                    ticks: {
                      color: "white",
                    },
                    grid: {
                      color: "rgba(255, 255, 255, 0.2)",
                    },
                  },
                },
              }}
            />
            {spreadGraphData.signal && (
              <p className="mt-2 text-center text-white">
                Signal: {spreadGraphData.signal.arrow} {spreadGraphData.signal.text}
              </p>
            )}
            {/* Legend for Buy and Sell Signals */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">↑</span>
                <span className="text-white text-sm">Buy Signal</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-red-500 text-lg">↓</span>
                <span className="text-white text-sm">Sell Signal</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {correlation !== null && (
        <p className="mt-4 text-white">
          Correlation: {correlation.toFixed(4)} {correlation > 0.8 ? "✅" : "❌"}
        </p>
      )}
      {cointegration !== null && (
        <p className="text-white">
          Cointegration: {cointegration.toFixed(4)} {cointegration < 0.1 ? "✅" : "❌"}
        </p>
      )}
      {adfTest !== null && (
        <p className="text-white">
          ADF Test Score: {adfTest.toFixed(4)} {adfTest < 0.1 ? "✅" : "❌"}
        </p>
      )}

      {/* Return to Home Button */}
      <div className="mt-6">
        <a
          href="https://alexmcnicholl.site"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}