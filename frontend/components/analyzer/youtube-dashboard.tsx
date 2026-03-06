"use client"

import { useState } from "react"
import { ArrowLeft, Globe, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { YoutubePublicDashboard } from "./youtube-public-dashboard"

type View = "home" | "public" | "private"

export function YoutubeDashboard() {
  const [view, setView] = useState<View>("home")

  if (view === "public") {
    return (
      <div>
        <button
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
          onClick={() => setView("home")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <YoutubePublicDashboard />
      </div>
    )
  }

  if (view === "private") {
    return (
      <div className="p-6">
        <button
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
          onClick={() => setView("home")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h2 className="text-2xl font-bold mb-2">
          Private Channel Analysis
        </h2>

        <p className="text-muted-foreground">
          Connect your YouTube channel using OAuth to analyze
          watch time, CTR, retention and subscriber insights.
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">YouTube Analyzer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => setView("public")}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <Globe className="h-8 w-8 text-primary" />

            <div>
              <h2 className="font-semibold text-lg">
                Public Video Analysis
              </h2>

              <p className="text-sm text-muted-foreground">
                Analyze any public YouTube video using comments
                and engagement metrics.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => setView("private")}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <User className="h-8 w-8 text-primary" />

            <div>
              <h2 className="font-semibold text-lg">
                Private Channel Insights
              </h2>

              <p className="text-sm text-muted-foreground">
                Connect your YouTube account for full analytics.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}