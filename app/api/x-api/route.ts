import { NextResponse } from "next/server";
import OpenAI from "openai";

// API keys from environment variables
interface ApiKeys {
  XAI_API_KEY: string;
  ODDS_API_KEY: string; // odds-api.com for real-time betting lines
  NBA_API_KEY: string; // NBA official API or similar
  ESPN_API_KEY: string; // ESPN API for team/player data
}

// Initialize API clients
const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function getCurrentOdds(team: string) {
  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=spreads,totals,h2h`
  );
  return response.json();
}

async function getTeamRoster(team: string) {
  const response = await fetch(
    `https://api.mysportsfeeds.com/v2.1/pull/nba/current/team/${team}/roster.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NBA_API_KEY}`,
      },
    }
  );
  return response.json();
}

async function getInjuryReport() {
  const response = await fetch(
    "https://api.mysportsfeeds.com/v2.1/pull/nba/current/injuries.json",
    {
      headers: {
        Authorization: `Bearer ${process.env.NBA_API_KEY}`,
      },
    }
  );
  return response.json();
}

export async function POST(request: Request) {
  const { query, team } = await request.json();

  try {
    // Fetch real-time data in parallel
    const [odds, roster, injuries] = await Promise.all([
      getCurrentOdds(team),
      getTeamRoster(team),
      getInjuryReport(),
    ]);

    // Create context from real-time data
    const context = {
      currentOdds: odds,
      teamRoster: roster,
      injuryReport: injuries,
    };

    const completion = await client.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: `You are an expert NBA betting analyst. Analyze the provided real-time data and respond in this structured format:

GAME OVERVIEW
- Teams Playing: [Home vs Away]
- Current Spread: [Favorite -X.X]
- Money Line: [Home/Away odds]
- Over/Under: [Total points]

KEY INJURIES & LINEUP CHANGES
- List only confirmed injuries/absences
- Include injury designation (Out/Questionable/Probable)
- Note any recent returns to lineup

LINE MOVEMENT ANALYSIS
- Opening Line vs Current Line
- Significant moves and triggers
- Sharp money indicators

BETTING OPPORTUNITIES
1. Spread Analysis:
   - Key matchups affecting spread
   - Historical ATS performance in similar situations
   - Recommendation with confidence level (1-5)

2. Player Props:
   - List 2-3 highest confidence props
   - Include current line and reasoning
   - Factor in defensive matchups

3. Game Totals:
   - Pace analysis
   - Recent scoring trends
   - Key factors affecting total

AVAILABLE DATA:
${JSON.stringify(context.currentOdds, null, 2)}
${JSON.stringify(context.teamRoster, null, 2)}
${JSON.stringify(context.injuryReport, null, 2)}

Guidelines:
- Use ONLY provided real-time data
- Include specific numbers and percentages
- Highlight any data-backed edges
- Rate confidence levels (1-5) for each recommendation
- Note any missing critical data

Respond with clear, actionable insights based solely on the provided data.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0, // Keep temperature low for consistency
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
      context, // Optional: return raw data for client-side use
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch betting data" },
      { status: 500 }
    );
  }
}
