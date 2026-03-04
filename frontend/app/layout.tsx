import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
// Import the client-side configuration wrapper
import AmplifyCognitoConfig from "./amplify-cognito-config";

const _inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "MediaMitra - Your Content Creator Companion",
  description:
    "MediaMitra helps content creators find their niche, analyze performance, and manage events with AI-powered tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_spaceGrotesk.variable} antialiased`}>
        {/* Wrapping children here ensures Amplify is configured 
          before any 'use client' pages or components run. 
        */}
        <AmplifyCognitoConfig>
          {children}
        </AmplifyCognitoConfig>
      </body>
    </html>
  );
}