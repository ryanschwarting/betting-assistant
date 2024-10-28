// Import necessary Next.js and local dependencies
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Configure Geist Sans variable font
// This loads the custom font file and sets up the CSS variable for use throughout the app
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans", // CSS variable name that can be referenced in styles
  weight: "100 900", // Supports all weights from 100 to 900
});

// Configure Geist Mono variable font for monospace text
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for the application
// This will be used for SEO and browser tab information
export const metadata: Metadata = {
  title: "NBA Betting Assistant",
  description: "Get betting insights for NBA games",
};

// Root layout component that wraps all pages
// This component is rendered on both server and client
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type definition for children prop
}>) {
  return (
    <html lang="en">
      <body
        // Apply font variables and antialiasing to the body
        // This makes the fonts available throughout the application
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
