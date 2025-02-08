export const dynamic = "force-dynamic"; // ✅ Fixes prerender error

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";

  try {
    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryDetail`
    );

    if (!response.data.quoteSummary.result) {
      return NextResponse.json({ error: "Invalid stock info" }, { status: 500 });
    }

    const stockInfo = response.data.quoteSummary.result[0].summaryDetail;

    return NextResponse.json({
      currentPrice: stockInfo.regularMarketPrice.raw,
      marketCap: stockInfo.marketCap.raw / 1e9, // Convert to billions
      volume: stockInfo.regularMarketVolume.raw,
      peRatio: stockInfo.trailingPE.raw,
      high52Week: stockInfo.fiftyTwoWeekHigh.raw,
      low52Week: stockInfo.fiftyTwoWeekLow.raw,
    });
  } catch (error) {
    console.error("Error fetching stock details:", error);
    return NextResponse.json({ error: "Failed to fetch stock details" }, { status: 500 });
  }
}
