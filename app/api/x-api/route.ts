import { NextResponse } from "next/server";
import OpenAI from "openai";

// X.AI API key from environment variables
const XAI_API_KEY = process.env.XAI_API_KEY;

// Initialize OpenAI client with X.AI-specific configuration
const client = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: "https://api.x.ai/v1", // X.AI-specific base URL
});

export async function POST(request: Request) {
  // Extract query from request body
  const { query } = await request.json();

  try {
    // Make a request to X.AI's chat completion API
    const completion = await client.chat.completions.create({
      model: "grok-beta", // X.AI's Grok model
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant specialized in NBA betting information. Provide concise and relevant information to help users make informed bets.",
        },
        { role: "user", content: query },
      ],
      temperature: 0, // Set to 0 for more deterministic outputs
    });

    // Return the AI-generated response
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    // Log the error and return a 500 status code
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from X API" },
      { status: 500 }
    );
  }
}
