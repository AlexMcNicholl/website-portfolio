import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

export async function POST(req: Request) {
    try {
        const { assetClass, subCategory, universeSize } = await req.json();
        console.log(`🔍 Received request: Asset Class: ${assetClass}, Category: ${subCategory}, Universe Size: ${universeSize}`);

        // ✅ Get the absolute path of the Python script
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const scriptPath = path.join(__dirname, "../../python/Coint_Valid.py"); // Adjust if needed

        console.log(`📂 Using script path: ${scriptPath}`);

        // ✅ Define Python executable
        const pythonPath = "python3"; // Use "python" on Windows if necessary
        console.log(`🐍 Using Python path: ${pythonPath}`);

        // ✅ Prepare JSON input for Python script
        const inputData = JSON.stringify({ assetClass, subCategory, universeSize });

        // ✅ Run the Python script with JSON input
        const process = spawn(pythonPath, [scriptPath, inputData]);

        return new Promise((resolve, reject) => {
            let output = "";
            let errorOutput = "";

            process.stdout.on("data", (data) => {
                output += data.toString();
                console.log(`📜 Python Output: ${output}`);
            });

            process.stderr.on("data", (data) => {
                errorOutput += data.toString();
                console.error(`❌ Python Error: ${errorOutput}`);
            });

            process.on("close", (code) => {
                if (code !== 0 || errorOutput) {
                    console.error("❌ Python script error:", errorOutput);
                    reject(NextResponse.json({ error: errorOutput || "Python script failed." }, { status: 500 }));
                    return;
                }

                try {
                    const parsedData = JSON.parse(output.trim());
                    console.log(`✅ Parsed Python Output: ${JSON.stringify(parsedData, null, 2)}`);
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
