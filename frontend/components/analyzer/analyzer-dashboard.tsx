"use client"

import { FaPinterest, FaSpotify } from "react-icons/fa"
import { useState } from "react"
import { YoutubeIcon, Instagram, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { YoutubeDashboard } from "./youtube-dashboard"
import { RedditDashboard } from "./reddit-dashboard"
import { PinterestDashboard } from "./pinterest-dashboard"

type Platform = "youtube" | "pinterest" | "reddit" | "instagram" | "spotify" | null

const platforms = [
  {
    name: "YouTube",
    icon: YoutubeIcon,
    key: "youtube",
    description: "Analyze video engagement, comments and performance",
  },
  {
    name: "Pinterest",
    icon: FaPinterest,
    key: "pinterest",
    description: "Analyze trending products, creators and viral topics",
  },
  {
    name: "Reddit",
    icon: MessageSquare,
    key: "reddit",
    description: "Analyze discussions and community sentiment",
  },
  {
    name: "Instagram",
    icon: Instagram,
    key: "instagram",
    description: "Analyze reels, posts and engagement",
  },
  {
    name: "Spotify",
    icon: FaSpotify,
    key: "spotify",
    description: "Analyze tracks, playlists and listener growth",
  }
]

export function AnalyzerDashboard() {
  const [activePlatform, setActivePlatform] = useState<Platform>(null)

  if (activePlatform === "youtube") return <YoutubeDashboard />
  if (activePlatform === "reddit") return <RedditDashboard />
  if (activePlatform === "pinterest") return <PinterestDashboard />

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold mb-8">
          MediaMitra Social Analyzer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {platforms.map((platform) => {
            const Icon = platform.icon

            return (
              <Card
                key={platform.name}
                className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition"
                onClick={() => setActivePlatform(platform.key as Platform)}
              >
                <CardContent className="flex items-center gap-4 p-6">

                  <Icon className="h-9 w-9 text-primary" />

                  <div>
                    <h2 className="font-semibold text-lg">
                      {platform.name}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>

                </CardContent>
              </Card>
            )
          })}

        </div>
      </div>
    </div>
  )
}