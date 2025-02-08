export const dynamic = "force-dynamic"; // ✅ Ensures this is always treated as dynamic

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`
    );

    if (!response.data.chart.result) {
      return NextResponse.json({ error: "Invalid stock data" }, { status: 500 });
    }

    const prices = response.data.chart.result[0];
    const timestamps = prices.timestamp;
    const closePrices = prices.indicators.quote[0].close;

    const formattedData = timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toLocaleDateString(),
      close: closePrices[index],
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
