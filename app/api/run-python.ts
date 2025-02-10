import { NextResponse } from "next/server";
import { PythonShell } from "python-shell";

export async function POST(req: Request) {
    try {
        const { stock1, stock2 } = await req.json();

        // Explicitly type `options` to match what `PythonShell.run()` expects
        let options: any = {
            mode: "text",
            pythonPath: "python",  // Change to "python3" if needed
            scriptPath: "./app/python/", // Ensure this matches where your script is stored
            args: [stock1, stock2],
        };

        // Run the Python script as a Promise with correctly typed options
        let results: string = await new Promise((resolve, reject) => {
            PythonShell.run("Coint_Valid.py", options)
                .then((messages) => resolve(messages ? messages.join("\n") : "No output returned"))
                .catch((err) => reject(err));
        });

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error("Error running Python script:", error);
        return NextResponse.json({ error: "Failed to run analysis." }, { status: 500 });
    }
}
