import { NextResponse } from "next/server";
import OpenAI from "openai";

const XAI_API_KEY = process.env.XAI_API_KEY;
const client = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function POST(request: Request) {
  const { query } = await request.json();

  try {
    const completion = await client.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant specialized in NBA betting information. Provide concise and relevant information to help users make informed bets.",
        },
        { role: "user", content: query },
      ],
      temperature: 0,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from X API" },
      { status: 500 }
    );
  }
}
