import { NextResponse } from "next/server";
import { runPairsTradingAnalysis } from "../../lib/pairs-trading";

export async function POST(req: Request) {
  try {
    const { stock1, stock2 } = await req.json();
    if (!stock1 || !stock2) {
      return NextResponse.json({ error: "Both stock symbols are required." }, { status: 400 });
    }

    const result = await runPairsTradingAnalysis(stock1, stock2);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
