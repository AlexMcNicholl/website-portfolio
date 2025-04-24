import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { idea } = await request.json();

  try {
    // Call OpenAI API to evaluate the idea
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert software developer evaluating project ideas.",
          },
          {
            role: "user",
            content: `Evaluate the following project idea: "${idea}". Provide a concise, single-paragraph description of the project, its feasibility for a small-scale developer, and the basic steps to implement it. Keep the response short and focused.`,
          },
        ],
        max_tokens: 150, // Limit the response length
        temperature: 0.7,
      }),
    });

    const data = await openAiResponse.json();

    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Failed to get a valid response from the AI. Please try again.",
      });
    }

    const aiResponse = data.choices[0].message.content.trim();

    // Extract title and description from the AI response
    const title = idea; // Use the user's idea as the title
    const description = aiResponse; // Use the AI's response as the description

    return NextResponse.json({
      success: true,
      title,
      description,
    });
  } catch (error) {
    console.error("Error evaluating idea:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while evaluating the idea. Please try again.",
    });
  }
}