"use client"

import { useState } from "react"
import { Calendar, Trophy, Brain } from "lucide-react"
import { ContentScheduler } from "./content-scheduler"
import { ChallengeTracker } from "./challenge-tracker"
import { ContentStrategizer } from "./content-strategizer"

type View = "home" | "scheduler" | "challenge" | "strategizer"

export function EventManagerDashboard() {

  const [view, setView] = useState<View>("home")

  if (view === "scheduler") return <ContentScheduler goBack={()=>setView("home")} />
  if (view === "challenge") return <ChallengeTracker goBack={()=>setView("home")} />
  if (view === "strategizer") return <ContentStrategizer goBack={()=>setView("home")} />

  return (
    <div className="px-6 py-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold mb-6">
          Creator Event Manager
        </h1>

        <p className="text-muted-foreground mb-10">
          Plan your content schedule, track consistency challenges, and analyze your strategy.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <button
            onClick={()=>setView("scheduler")}
            className="p-6 rounded-xl border hover:bg-muted transition"
          >
            <Calendar className="mb-3"/>
            <h3 className="font-semibold">Content Scheduler</h3>
            <p className="text-sm text-muted-foreground">
              Plan posts, schedule reminders, and manage upcoming uploads.
            </p>
          </button>

          <button
            onClick={()=>setView("challenge")}
            className="p-6 rounded-xl border hover:bg-muted transition"
          >
            <Trophy className="mb-3"/>
            <h3 className="font-semibold">Challenge Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Build consistency with daily posting challenges.
            </p>
          </button>

          <button
            onClick={()=>setView("strategizer")}
            className="p-6 rounded-xl border hover:bg-muted transition"
          >
            <Brain className="mb-3"/>
            <h3 className="font-semibold">Content Strategizer</h3>
            <p className="text-sm text-muted-foreground">
              AI insights on performance and content strategy.
            </p>
          </button>

        </div>

      </div>

    </div>
  )
}