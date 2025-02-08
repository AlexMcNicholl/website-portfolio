import { NextResponse } from "next/server";

<<<<<<< HEAD
export async function POST(req) {
=======
export async function POST(req: { json: () => PromiseLike<{ name: any; email: any; message: any; }> | { name: any; email: any; message: any; }; }) {
>>>>>>> fd03747 (Finance Viz Project)
  try {
    const { name, email, message } = await req.json();
    console.log("Received form submission:", { name, email, message });

    // You can add email-sending logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
