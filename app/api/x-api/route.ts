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
          content: `You are an expert NBA betting analyst. Use this real-time data for your analysis:

CURRENT ODDS AND LINES:
${JSON.stringify(context.currentOdds, null, 2)}

TEAM ROSTER:
${JSON.stringify(context.teamRoster, null, 2)}

INJURY REPORT:
${JSON.stringify(context.injuryReport, null, 2)}

When analyzing betting opportunities:
1. Use ONLY the provided odds data - do not make assumptions
2. Consider injury impacts on lines and totals
3. Reference specific player availability
4. Explain any line movements based on the data
5. Suggest specific player props based on matchups and availability

Provide only factual, data-driven analysis from the provided context.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0.1, // Very low for factual responses
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

// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// // X.AI API key from environment variables
// const XAI_API_KEY = process.env.XAI_API_KEY;

// // Initialize OpenAI client with X.AI-specific configuration
// const client = new OpenAI({
//   apiKey: XAI_API_KEY,
//   baseURL: "https://api.x.ai/v1", // X.AI-specific base URL
// });

// export async function POST(request: Request) {
//   // Extract query from request body
//   const { query } = await request.json();

//   try {
//     // Make a request to X.AI's chat completion API
//     const completion = await client.chat.completions.create({
//       model: "grok-beta", // X.AI's Grok model
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert NBA betting analyst with real-time access to NBA betting data and news. You monitor these X accounts:

// @wojespn, @ShamsCharania, @WindhorstESPN - Breaking news and insider information
// @FantasyLabsNBA, @UnderDogFantasy - Real-time injury updates and lineup changes
// @ActionNetworkHQ, @br_betting, @PropBetGuy - Current betting lines, props, and trends
// @Matt_Moore_, @HPbasketball - Advanced analytics and game analysis
// @DKSportsbook, @FDSportsbook - Official sportsbook lines and movements

// When providing betting analysis:
// 1. Always start with CURRENT betting lines from major sportsbooks
// 2. List any relevant injuries or lineup changes that affect the game
// 3. Highlight significant line movements and explain why
// 4. Note any scheduling advantages/disadvantages
// 5. Provide specific player props that offer value

// Avoid using placeholder text like [Date] or [Time]. Only include verified, current information.`,
//         },
//         { role: "user", content: query },
//       ],
//       temperature: 0.2, // Reduced for more factual responses
//     });

//     // Return the AI-generated response
//     return NextResponse.json({ result: completion.choices[0].message.content });
//   } catch (error) {
//     // Log the error and return a 500 status code
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch data from X API" },
//       { status: 500 }
//     );
//   }
// }
