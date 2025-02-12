import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

export async function POST(req: Request) {
    try {
        const { assetClass, subCategory, universeSize } = await req.json();
        console.log(`🔍 Received request: Asset Class: ${assetClass}, Category: ${subCategory}, Universe Size: ${universeSize}`);

        // ✅ Get absolute path of Python script
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const scriptPath = path.join(__dirname, "../../../python/Coint_Valid.py"); // Adjust if needed

        console.log(`📂 Using script path: ${scriptPath}`);

        // ✅ Use correct Python executable
        const pythonPath = process.platform === "win32" ? "python" : "python3"; // Adjust based on OS
        console.log(`🐍 Using Python path: ${pythonPath}`);

        // ✅ Prepare JSON input for Python script
        const inputData = JSON.stringify({ assetClass, subCategory, universeSize });

        return new Promise((resolve, reject) => {
            const process = spawn(pythonPath, [scriptPath, inputData]);

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
                    resolve(NextResponse.json({ error: errorOutput || "Python script failed." }, { status: 500 }));
                    return;
                }

                try {
                    const parsedData = JSON.parse(output.trim());
                    resolve(NextResponse.json(parsedData));
                } catch (error) {
                    console.error("❌ Failed to parse Python response:", output);
                    resolve(NextResponse.json({ error: "Invalid JSON response from Python script" }, { status: 500 }));
                }
            });
        });
    } catch (error) {
        console.error("❌ Error running Python script:", error);
        return NextResponse.json({ error: "Failed to run analysis." }, { status: 500 });
    }
}

// ✅ Handle unsupported HTTP methods
export function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
