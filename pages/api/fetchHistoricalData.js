import yahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  try {
    const { tickers, period1, period2 } = req.query;

    if (!tickers || tickers.split(",").length < 2) {
      return res.status(400).json({ error: "At least two tickers are required." });
    }

    const [ticker1, ticker2] = tickers.split(",");
    const historicalData = await Promise.all([
      yahooFinance.chart(ticker1, { period1, period2 }),
      yahooFinance.chart(ticker2, { period1, period2 }),
    ]);

    res.status(200).json({ historicalData });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ error: "Failed to fetch historical data." });
  }
}