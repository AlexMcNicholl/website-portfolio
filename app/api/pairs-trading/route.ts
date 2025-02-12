import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Received request:", body);

        // Get the absolute path of the Python script
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const scriptPath = path.join(__dirname, "../../../python/Coint_Valid.py");

        console.log(`📂 Running Python script at: ${scriptPath}`);

        return new Promise((resolve) => {
            const process = spawn("python3", [scriptPath, JSON.stringify(body)]);

            let output = "";
            let errorOutput = "";

            process.stdout.on("data", (data) => {
                output += data.toString();
            });

            process.stderr.on("data", (data) => {
                errorOutput += data.toString();
            });

            process.on("close", () => {
                if (errorOutput) {
                    console.error("❌ Python Error:", errorOutput);
                    resolve(NextResponse.json({ error: errorOutput }, { status: 500 }));
                    return;
                }

                try {
                    console.log("✅ Raw Python Output:", output);
                    const result = JSON.parse(output.trim());
                    console.log("✅ Parsed Python Output:", result);
                    resolve(NextResponse.json(result));
                } catch (error) {
                    console.error("❌ JSON Parse Error:", output);
                    resolve(NextResponse.json({ error: "Invalid Python output" }, { status: 500 }));
                }
            });
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
