"use client"

import { useEffect, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"

const API = process.env.NEXT_PUBLIC_EVENTS_API || ""

interface EventItem {
  id: string
  title: string
  topic?: string
  platform: string
  time: string
  status: string
}

export function ContentScheduler({ goBack }: { goBack: () => void }) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [platform, setPlatform] = useState("YouTube")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      const res = await fetch(API, {
        headers: {
          Authorization: token!
        }
      })

      const data = await res.json()

      if (Array.isArray(data)) {
        setEvents(data)
      } else if (data.body) {
        setEvents(JSON.parse(data.body))
      } else {
        setEvents([])
      }
    } catch (err) {
      console.error("Load events error:", err)
      setEvents([])
    }
  }

  async function createEvent() {
    if (!title || !date || !time) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)

    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      const isoTime = new Date(`${date}T${time}`).toISOString()

      const payload = {
        title,
        topic: title,
        platform,
        time: isoTime
      }

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!
        },
        body: JSON.stringify(payload)
      })

      await res.json()

      setTitle("")
      setDate("")
      setTime("")
      setPlatform("YouTube")

      await loadEvents()
    } catch (err) {
      console.error("Create event error:", err)
      alert("Event creation failed")
    }

    setLoading(false)
  }

  function platformColor(p: string) {
    if (p === "YouTube") return "bg-red-500/20 text-red-400"
    if (p === "Instagram") return "bg-pink-500/20 text-pink-400"
    if (p === "Shorts") return "bg-yellow-500/20 text-yellow-400"
    if (p === "TikTok") return "bg-cyan-500/20 text-cyan-400"

    return "bg-gray-500/20 text-gray-400"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="text-sm text-muted-foreground hover:text-white"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-semibold">Content Scheduler</h2>
      </div>

      {/* Schedule Form */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Schedule New Content</h3>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Content title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-3 bg-background"
          />

          <input
            type="date"
            value={date}
            onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-3 bg-background cursor-pointer"
          />

          <input
            type="time"
            value={time}
            onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded-lg p-3 bg-background cursor-pointer"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border rounded-lg p-3 bg-background"
          >
            <option>YouTube</option>
            <option>Instagram</option>
            <option>Shorts</option>
            <option>TikTok</option>
          </select>
        </div>

        <button
          onClick={createEvent}
          disabled={loading}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
        >
          {loading ? "Scheduling..." : "Schedule Content"}
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upcoming Content</h3>

        {events.length === 0 && (
          <div className="text-center py-10 text-muted-foreground border rounded-lg">
            No scheduled content yet.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e) => (
            <div
              key={e.id}
              className="border rounded-xl p-5 bg-card hover:border-primary transition"
            >
              <h4 className="font-semibold text-lg mb-2">{e.title}</h4>

              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${platformColor(
                    e.platform
                  )}`}
                >
                  {e.platform}
                </span>

                <span className="text-xs text-muted-foreground">
                  {e.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {new Date(e.time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
