import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

export async function POST(req: Request) {
    try {
        const { stock1, stock2 } = await req.json();
        console.log(`🔍 Received request for stocks: ${stock1}, ${stock2}`);

        // ✅ Get the absolute path of the Python script correctly
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const scriptPath = path.join(__dirname, "../../python/Coint_Valid.py"); // Adjust if needed

        console.log(`📂 Using scriptPath: ${scriptPath}`);

        // ✅ Spawn a new process to run Python script
        const process = spawn("python3", [scriptPath, stock1, stock2]);

        return new Promise((resolve, reject) => {
            let output = "";
            let errorOutput = "";

            process.stdout.on("data", (data) => {
                output += data.toString();
            });

            process.stderr.on("data", (data) => {
                errorOutput += data.toString();
            });

            process.on("close", (code) => {
                if (code !== 0 || errorOutput) {
                    console.error("❌ Python script error:", errorOutput);
                    reject(NextResponse.json({ error: errorOutput || "Python script failed." }, { status: 500 }));
                    return;
                }

                console.log(`✅ Python script output: ${output}`);
                try {
                    const parsedData = JSON.parse(output.trim());
                    resolve(NextResponse.json(parsedData));
                } catch (error) {
                    console.error("❌ Failed to parse Python response:", output);
                    reject(NextResponse.json({ error: "Invalid JSON response from Python script" }, { status: 500 }));
                }
            });
        });
    } catch (error) {
        console.error("❌ Error running Python script:", error);
        return NextResponse.json({ error: "Failed to run analysis." }, { status: 500 });
    }
}
