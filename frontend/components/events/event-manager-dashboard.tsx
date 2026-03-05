"use client"

import { useState } from "react"
import { Calendar, Trophy } from "lucide-react"
import { ContentScheduler } from "./content-scheduler"
import { ChallengeTracker } from "./challenge-tracker"

type View = "home" | "scheduler" | "challenge"

export function EventManagerDashboard() {

  const [view, setView] = useState<View>("home")

  if (view === "scheduler") return <ContentScheduler goBack={()=>setView("home")} />
  if (view === "challenge") return <ChallengeTracker goBack={()=>setView("home")} />

  return (
    <div className="px-6 py-16 flex justify-center">

      <div className="w-full max-w-4xl">

        <h1 className="text-4xl font-bold text-center mb-4">
          Creator Event Manager
        </h1>

        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Plan your content schedule, track consistency challenges, and analyze your strategy.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <button
            onClick={()=>setView("scheduler")}
            className="p-8 rounded-xl border flex flex-col items-center text-center hover:bg-muted transition"
          >
            <Calendar className="w-8 h-8 mb-4"/>
            <h3 className="font-semibold">Content Scheduler</h3>
            <p className="text-sm text-muted-foreground">
              Plan posts, schedule reminders, and manage upcoming uploads.
            </p>
          </button>

          <button
            onClick={()=>setView("challenge")}
            className="p-8 rounded-xl border flex flex-col items-center text-center hover:bg-muted transition"
          >
            <Trophy className="w-8 h-8 mb-4"/>
            <h3 className="font-semibold">Challenge Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Build consistency with daily posting challenges.
            </p>
          </button>

        </div>

      </div>

    </div>
  )
}