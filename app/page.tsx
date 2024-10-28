// Import the NBABettingAssistant component from the components directory
import { NBABettingAssistant } from "@/components/NBABettingAssistant";

// Define the Home component as the default export
export default function Home() {
  return (
    // Main container with full height and light gray background
    <div className="min-h-screen bg-gray-100 py-12">
      <main className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          NBA Betting Assistant
        </h1>
        <NBABettingAssistant />
      </main>
    </div>
  );
}
