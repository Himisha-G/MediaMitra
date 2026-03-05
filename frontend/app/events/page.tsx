"use client"

import { Navbar } from "@/components/navbar"
import { EventManagerDashboard } from "@/components/events/event-manager-dashboard"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export default function EventsPage() {
  useAuthGuard()

  return (
    <>
      <Navbar />
      <main className="pt-[73px]">
        <EventManagerDashboard />
      </main>
    </>
  )
}