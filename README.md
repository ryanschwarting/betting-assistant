# NBA Betting Assistant

## Overview

The NBA Betting Assistant is a Next.js application that provides users with AI-powered insights for NBA betting. It leverages the X.AI API to generate concise and relevant information to help users make informed bets on NBA games.

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework for server-side rendering and static site generation
- [React 18](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [OpenAI SDK](https://github.com/openai/openai-node) - Official OpenAI API library for Node.js
- [X.AI API](https://x.ai/) - AI model API for generating betting insights

## Features

- User-friendly interface for querying NBA betting information
- AI-powered responses using the X.AI API
- Responsive design for mobile and desktop devices

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/betting-assistant.git
   cd nba-betting-assistant
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file to `.env.local`:
     ```
     cp .env.example .env.local
     ```
   - Open `.env.local` and add your X.AI API key:
     ```
     XAI_API_KEY=your_api_key_here
     ```
     Note: You can obtain an API key from the [X.AI documentation](https://docs.x.ai/docs#getting-started).

4. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter your NBA betting question in the input field.
2. Click the "Get Betting Info" button.
3. Wait for the AI-generated response to appear below the input field.

## Project Structure

- `app/`: Next.js app directory containing pages and API routes
- `components/`: React components, including the main NBABettingAssistant component
- `lib/`: Utility functions and shared code
- `public/`: Static assets
- `styles/`: Global CSS styles

## API Routes

The application uses a custom API route to communicate with the X.AI API:

This route handles POST requests, forwards the user's query to the X.AI API, and returns the AI-generated response.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
