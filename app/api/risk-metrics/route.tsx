import axios from "axios";
import { mean } from "mathjs";
import { NextResponse } from "next/server";

// Define RiskRequestBody type if not imported from elsewhere
type RiskRequestBody = {
  tickers: string[];
  weights: number[];
  yearsBack: number;
  benchmark?: boolean;
};

export async function POST(req: Request) {
  try {
    const body: RiskRequestBody & { interval?: string } = await req.json();
    const { tickers, weights, yearsBack, benchmark, interval = "1mo" } = body;

    if (!tickers || !weights || tickers.length !== weights.length) {
      return NextResponse.json({ error: "Invalid tickers or weights" }, { status: 400 });
    }

    const rangeMap: { [key: number]: string } = {
      1: "1y",
      3: "3y",
      5: "5y",
      10: "10y",
    };

    const range = rangeMap[yearsBack] || "1y";

    const fetchTickerData = async (symbol: string) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const response = await axios.get(url);
        const result = response.data.chart.result?.[0];

        if (!result || !result.timestamp || !result.indicators.quote[0].close) {
          throw new Error(`No data for ${symbol}`);
        }

        return {
          symbol,
          timestamps: result.timestamp,
          closePrices: result.indicators.quote[0].close,
        };
      } catch (err) {
        throw new Error(`Failed to fetch ${symbol}`);
      }
    };

    const tickerData: any[] = [];
    const failedTickers: string[] = [];

    for (const ticker of tickers) {
      try {
        const data = await fetchTickerData(ticker);
        tickerData.push(data);
      } catch (err) {
        console.warn(`Skipping ${ticker}:`, err);
        failedTickers.push(ticker);
      }
    }

    if (tickerData.length === 0) {
      return NextResponse.json({ error: "No valid tickers retrieved." }, { status: 400 });
    }

    let benchmarkData: any = null;
    if (benchmark) {
      try {
        benchmarkData = await fetchTickerData("SPY");
      } catch (err) {
        console.warn("Benchmark fetch failed:", err);
      }
    }

    const monthlyReturns = tickerData.map(ticker => {
      const returns = [];
      for (let i = 1; i < ticker.closePrices.length; i++) {
        const ret = (ticker.closePrices[i] - ticker.closePrices[i - 1]) / ticker.closePrices[i - 1];
        returns.push(ret);
      }
      return { symbol: ticker.symbol, returns };
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const normalizedWeights = weights.map(w => w / totalWeight);

    const portfolioReturns: number[] = [];
    const portfolioDates: string[] = [];
    const numPeriods = monthlyReturns[0].returns.length;

    for (let i = 0; i < numPeriods; i++) {
      let periodReturn = 0;
      for (let j = 0; j < tickerData.length; j++) {
        periodReturn += monthlyReturns[j].returns[i] * normalizedWeights[j];
      }
      portfolioReturns.push(periodReturn);
      const timestamp = tickerData[0].timestamps[i + 1];
      portfolioDates.push(new Date(timestamp * 1000).toISOString().split("T")[0]);
    }

    let benchmarkReturns: number[] | null = null;
    let benchmarkDates: string[] | null = null;

    if (benchmarkData) {
      benchmarkReturns = [];
      benchmarkDates = [];

      for (let i = 1; i < benchmarkData.closePrices.length; i++) {
        const ret = (benchmarkData.closePrices[i] - benchmarkData.closePrices[i - 1]) / benchmarkData.closePrices[i - 1];
        benchmarkReturns.push(ret);
        benchmarkDates.push(new Date(benchmarkData.timestamps[i] * 1000).toISOString().split("T")[0]);
      }
    }

    const avg = mean(portfolioReturns);
    const std = stdDev(portfolioReturns, avg);
    const sharpe = (avg / std) * Math.sqrt(12);
    const sortedReturns = [...portfolioReturns].sort((a, b) => a - b);
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)];
    const cvar95 = sortedReturns.filter(r => r <= var95).reduce((a, b) => a + b, 0) / sortedReturns.filter(r => r <= var95).length;
    const weightedPrices = tickerData[0].closePrices.map((_: any, i: number) =>
      tickerData.reduce((sum, t, j) => sum + t.closePrices[i] * normalizedWeights[j], 0)
    );
    const maxDD = maxDrawdown(weightedPrices);

    let beta = null;
    if (benchmarkReturns) {
      const corr = correlation(portfolioReturns, benchmarkReturns);
      beta = corr * (std / stdDev(benchmarkReturns, mean(benchmarkReturns)));
    }

    const matrix = monthlyReturns.map(a =>
      monthlyReturns.map(b => correlation(a.returns, b.returns))
    );

    const realMetrics = {
      var: `${(var95 * 100).toFixed(2)}%`,
      cvar: `${(cvar95 * 100).toFixed(2)}%`,
      sharpeRatio: sharpe.toFixed(2),
      maxDrawdown: `${(maxDD * 100).toFixed(2)}%`,
      beta: beta !== null ? beta.toFixed(2) : null,
      correlationMatrix: matrix,
    };

    return NextResponse.json({
      tickers,
      weights,
      range,
      metrics: realMetrics,
      rawData: tickerData,
      portfolioReturns,
      portfolioDates,
      benchmarkReturns,
      benchmarkDates,
      benchmark: benchmarkData?.symbol || null,
      failedTickers,
    });
  } catch (error) {
    console.error("Risk API error:", error);
    return NextResponse.json({ error: "Failed to compute risk metrics" }, { status: 500 });
  }
}
function stdDev(portfolioReturns: number[], avg: number): number {
  const variance = portfolioReturns.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (portfolioReturns.length - 1);
  return Math.sqrt(variance);
}

function maxDrawdown(weightedPrices: number[]): number {
  let maxPeak = weightedPrices[0];
  let maxDD = 0;
  for (let price of weightedPrices) {
    if (price > maxPeak) maxPeak = price;
    const drawdown = (maxPeak - price) / maxPeak;
    if (drawdown > maxDD) maxDD = drawdown;
  }
  return maxDD;
}

function correlation(portfolioReturns: number[], benchmarkReturns: number[]): number {
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  const meanA = mean(portfolioReturns.slice(0, n));
  const meanB = mean(benchmarkReturns.slice(0, n));
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;
  for (let i = 0; i < n; i++) {
    const diffA = portfolioReturns[i] - meanA;
    const diffB = benchmarkReturns[i] - meanB;
    numerator += diffA * diffB;
    denomA += diffA * diffA;
    denomB += diffB * diffB;
  }
  return denomA && denomB ? numerator / Math.sqrt(denomA * denomB) : 0;
}

