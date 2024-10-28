"use client"; // Indicates that this is a client-side component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NBABettingAssistant() {
  // State variables to manage the component's data and UI
  const [query, setQuery] = useState(""); // Stores the user's input query
  const [result, setResult] = useState(""); // Stores the AI-generated result
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state during API call

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Set loading state to true

    try {
      // Send a POST request to the API route
      const response = await fetch("/api/x-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }), // Send the user's query to the API
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResult(data.result); // Update the result state with the AI response
    } catch (error) {
      console.error("Error:", error);
      setResult("Failed to fetch data. Please try again."); // Set error message if request fails
    } finally {
      setIsLoading(false); // Set loading state back to false when done
    }
  };

  // Render the component UI
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">NBA Betting Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state on input change
          placeholder="Ask an NBA betting question..."
          className="w-full"
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Loading..." : "Get Betting Info"}
        </Button>
      </form>
      {result && ( // Conditionally render the result section
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
}
