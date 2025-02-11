import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const { stock1, stock2 } = await req.json();

    // Change 'python' to 'python3' for Mac/Linux
    const pythonProcess = spawn("python3", ["app/python/Coint_Valid.py", stock1, stock2]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    return new Promise((resolve) => {
      pythonProcess.on("close", () => {
        resolve(NextResponse.json({ result: output }));
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Error executing Python script" }, { status: 500 });
  }
}
