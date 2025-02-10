import { NextRequest, NextResponse } from "next/server";
import { PythonShell } from "python-shell";
import util from "util";

export async function POST(req: NextRequest) {
  try {
    const { stock1, stock2 } = await req.json();

    let options = {
      pythonPath: "python", // Ensure Python is accessible
      scriptPath: "./scripts/", // Ensure this matches the actual script location
      args: [stock1, stock2],
    };

    // Promisify PythonShell for proper async handling
    const runPythonScript = util.promisify(PythonShell.run);

    try {
      const output = await runPythonScript("backtest_pairs_trading.py", options);

      console.log("Python script output:", output);

      return NextResponse.json(
        { data: Array.isArray(output) ? output.join("\n") : "No valid output returned" },
        { status: 200 }
      );
    } catch (err) {
      console.error("Python script error:", err);
      return NextResponse.json(
        { error: "Error executing Python script" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request handling error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Invalid request" },
      { status: 400 }
    );
  }
}
