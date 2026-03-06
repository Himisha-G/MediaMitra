"use client"

import { useState } from "react"
import { YoutubeIcon, Instagram, Twitter, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { YoutubeDashboard } from "./youtube-dashboard"

import { RedditDashboard } from "./reddit-dashboard"
import { InstagramDashboard } from "./instagram-dashboard"

type Platform = "youtube" | "x" | "reddit" | "instagram" | null

const platforms = [
  {
    name: "YouTube",
    icon: YoutubeIcon,
    key: "youtube",
    description: "Analyze video engagement, comments and performance",
  },
  {
    name: "X (Twitter)",
    icon: Twitter,
    key: "x",
    description: "Analyze tweets, engagement and sentiment",
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
    description: "Analyze reels, posts and audience engagement",
  },
]

export function AnalyzerDashboard() {
  const [activePlatform, setActivePlatform] = useState<Platform>(null)

  if (activePlatform === "youtube") return <YoutubeDashboard />
  if (activePlatform === "reddit") return <RedditDashboard />
  if (activePlatform === "instagram") return <InstagramDashboard />

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold mb-6">
          Social Media Analyzer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {platforms.map((platform) => {
            const Icon = platform.icon

            return (
              <Card
                key={platform.name}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => setActivePlatform(platform.key as Platform)}
              >
                <CardContent className="flex items-center gap-4 p-6">

                  <Icon className="h-8 w-8 text-primary" />

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