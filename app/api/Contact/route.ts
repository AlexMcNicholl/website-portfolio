import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.text(); // Read the request body as text
    console.log("Raw request body:", body); // Log the raw request body

    const { name, email, message } = JSON.parse(body); // Parse the JSON body
    console.log("Parsed form submission:", { name, email, message });

    // Validate input
    if (!name || !email || !message) {
      console.error("Validation failed: Missing fields");
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Define email options
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Your email address to receive the message
      subject: `Contact Form Submission from ${name}`,
      text: message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
