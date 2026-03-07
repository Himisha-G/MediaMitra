"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Globe, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { YoutubePublicDashboard } from "./youtube-public-dashboard"
import { YoutubePrivate } from "./youtube-private"
type View = "home" | "public" | "private"

export function YoutubeDashboard({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<View>("home")

  useEffect(() => {

    if (window.location.search.includes("yt=connected")) {

      setView("private")

      window.history.replaceState({}, "", "/analyzer")

    }

  }, [])


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
      <div>
  
        <button
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
          onClick={() => setView("home")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
  
        <YoutubePrivate />
  
      </div>
    )
  }


  return (
    <div className="px-6 py-8">
        <button
      onClick={onBack}
      className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-white transition"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Analyzer
    </button>
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