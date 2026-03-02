"use client"

import { useState } from "react"
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  LogOut,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EventItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  status: "upcoming" | "completed" | "cancelled"
}

const sampleEvents: EventItem[] = [
  {
    id: "1",
    title: "YouTube Live Stream",
    date: "2026-03-15",
    time: "18:00",
    location: "YouTube Studio",
    description: "Monthly Q&A live stream with subscribers.",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Brand Collaboration Meeting",
    date: "2026-03-20",
    time: "14:00",
    location: "Zoom",
    description: "Discuss partnership details with TechBrand Co.",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Content Planning Session",
    date: "2026-02-28",
    time: "10:00",
    location: "Home Office",
    description: "Plan next month's content calendar.",
    status: "completed",
  },
]

interface EventManagerDashboardProps {
  userEmail: string
  onLogout: () => void
}

export function EventManagerDashboard({
  userEmail,
  onLogout,
}: EventManagerDashboardProps) {
  const [events, setEvents] = useState<EventItem[]>(sampleEvents)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all")
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  })

  const resetForm = () => {
    setForm({ title: "", date: "", time: "", location: "", description: "" })
    setShowForm(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!form.title || !form.date) return

    if (editingId) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingId ? { ...e, ...form, status: e.status } : e
        )
      )
    } else {
      const newEvent: EventItem = {
        id: Date.now().toString(),
        ...form,
        status: "upcoming",
      }
      setEvents((prev) => [...prev, newEvent])
    }
    resetForm()
  }

  const handleEdit = (event: EventItem) => {
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const handleStatusToggle = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: e.status === "completed" ? "upcoming" : "completed",
            }
          : e
      )
    )
  }

  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.status === filter)

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-[var(--font-heading)] text-3xl font-bold text-foreground">
              Event Manager
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Logged in as{" "}
              <span className="text-primary">{userEmail}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setForm({ title: "", date: "", time: "", location: "", description: "" })
              }}
              className="rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
            <Button variant="outline" onClick={onLogout} className="rounded-xl">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", "upcoming", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Event Form */}
        {showForm && (
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-[var(--font-heading)] text-lg font-semibold text-foreground">
                  {editingId ? "Edit Event" : "Create New Event"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., YouTube Live Stream"
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g., Zoom, YouTube Studio"
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="event-desc">Description</Label>
                  <Input
                    id="event-desc"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Brief description"
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={resetForm} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!form.title || !form.date}
                  className="rounded-xl"
                >
                  {editingId ? "Update" : "Create"} Event
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="flex flex-col gap-4">
          {filteredEvents.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                No events found. Create one to get started!
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card
                key={event.id}
                className={cn(
                  "border-border bg-card transition-colors",
                  event.status === "completed" && "opacity-60"
                )}
              >
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleStatusToggle(event.id)}
                      className={cn(
                        "mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        event.status === "completed"
                          ? "border-primary bg-primary"
                          : "border-border hover:border-primary"
                      )}
                      aria-label={
                        event.status === "completed"
                          ? "Mark as upcoming"
                          : "Mark as completed"
                      }
                    >
                      {event.status === "completed" && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={cn(
                          "font-[var(--font-heading)] font-semibold text-foreground",
                          event.status === "completed" && "line-through"
                        )}
                      >
                        {event.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(event)}
                      aria-label="Edit event"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                      aria-label="Delete event"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
