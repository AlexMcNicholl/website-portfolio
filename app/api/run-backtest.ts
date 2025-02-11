import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: Request) {
    try {
        const { stock1, stock2 } = await req.json();

        const scriptPath = path.join(process.cwd(), "scripts", "backtest_pairs_trading.py");

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn("python3", [scriptPath, stock1, stock2]);

            let output = "";
            pythonProcess.stdout.on("data", (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                console.error(`Python Error: ${data.toString()}`);
            });

            pythonProcess.on("close", (code) => {
                if (code === 0) {
                    try {
                        const parsedOutput = JSON.parse(output);
                        resolve(NextResponse.json(parsedOutput));
                    } catch (err) {
                        reject(NextResponse.json({ error: "Invalid JSON output from Python script." }, { status: 500 }));
                    }
                } else {
                    reject(NextResponse.json({ error: "Python script execution failed." }, { status: 500 }));
                }
            });
        });
    } catch (error) {
        console.error("Error running Python script:", error);
        return NextResponse.json({ error: "Failed to run backtest." }, { status: 500 });
    }
}
