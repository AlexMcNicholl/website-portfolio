import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    console.log("Received form submission:", { name, email, message });

    // You can add email-sending logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
