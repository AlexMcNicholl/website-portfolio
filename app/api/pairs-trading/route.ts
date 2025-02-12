import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Received request:", body);

        if (!body.assetClass || !body.subCategory || !body.universeSize) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const result = {
            status: "success",
            message: "Pairs analyzed successfully",
            data: {
                assetClass: body.assetClass,
                subCategory: body.subCategory,
                universeSize: body.universeSize,
                pairs: ["MSFT", "AMZN"] // Replace with real data processing
            }
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ Error in /api/pairs-trading:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle unsupported HTTP methods
export function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
