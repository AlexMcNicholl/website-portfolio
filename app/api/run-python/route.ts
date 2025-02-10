import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { stock1, stock2 } = await req.json();
    const scriptPath = path.join(process.cwd(), "app", "python", "Coint_Valid.py");

    return new Promise((resolve) => {
      const process = spawn("python", [scriptPath, stock1, stock2]);

      let output = "";
      let errorOutput = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          try {
            // Ensure the output is valid JSON
            const parsedOutput = JSON.parse(output.trim());
            resolve(NextResponse.json(parsedOutput, { status: 200 }));
          } catch (jsonError) {
            resolve(NextResponse.json({ error: "Invalid JSON format received from Python" }, { status: 500 }));
          }
        } else {
          resolve(NextResponse.json({ error: "Error executing Python script", details: errorOutput }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }
}
