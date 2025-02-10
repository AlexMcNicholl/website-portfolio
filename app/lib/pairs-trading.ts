import yfinance from "yahoo-finance2";

export async function runPairsTradingAnalysis(stock1: string, stock2: string) {
  try {
    const startDate = "2023-01-01";
    const endDate = "2024-01-01";
    
    const stock1Data = await yfinance.historical(stock1, { period1: startDate, period2: endDate, interval: "1d" });
    const stock2Data = await yfinance.historical(stock2, { period1: startDate, period2: endDate, interval: "1d" });

    if (!stock1Data || !stock2Data) {
      throw new Error("Could not retrieve stock data.");
    }

    // Call Python API for Cointegration Test
    const response = await fetch("/api/run-python", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock1, stock2 }),
    });

    const data = await response.json();

    return {
      message: data.passed
        ? `✅ ${stock1} and ${stock2} are statistically significant for pairs trading!`
        : `❌ ${stock1} and ${stock2} do not pass the cointegration test.`,
      backtestAvailable: data.passed,
    };
  } catch (error) {
    return { message: "Error analyzing pair.", backtestAvailable: false };
  }
}
