"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

const API = process.env.NEXT_PUBLIC_EVENTS_API || ""

interface EventItem {
id: string
title: string
platform: string
time: string
status: "scheduled" | "completed" | "missed"
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
headers: { Authorization: token! }
})

const data = await res.json()

let parsed: EventItem[] = []

if (Array.isArray(data)) parsed = data
else if (data.body) parsed = JSON.parse(data.body)

const now = new Date()

parsed = parsed.map((e) => {

if (e.status === "completed") return e

const eventTime = new Date(e.time)

if (eventTime < now) {
return { ...e, status: "missed" }
}

return e

})

setEvents(parsed)

} catch (err) {
console.error("Load events error", err)
}

}

async function createEvent() {

if (!title || !date || !time) {
alert("Fill all fields")
return
}

setLoading(true)

try {

const session = await fetchAuthSession()
const token = session.tokens?.idToken?.toString()

const isoTime = new Date(`${date}T${time}`).toISOString()

const payload = {
title,
platform,
time: isoTime
}

await fetch(API, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: token!
},
body: JSON.stringify(payload)
})

setTitle("")
setDate("")
setTime("")

await loadEvents()

} catch (err) {
console.error(err)
}

setLoading(false)

}

function markCompleted(id: string) {

setEvents((prev) =>
prev.map((e) =>
e.id === id
? { ...e, status: "completed" }
: e
)
)

}

const stats = useMemo(() => {

let completed = 0
let missed = 0
let scheduled = 0

events.forEach((e) => {

if (e.status === "completed") completed++
else if (e.status === "missed") missed++
else scheduled++

})

return [
{ name: "missed", value: missed },
{ name: "completed", value: completed },
{ name: "scheduled", value: scheduled }
]

}, [events])

return (

<div className="max-w-7xl mx-auto space-y-8 px-6">

<div className="flex justify-between items-center">

<button
onClick={goBack}
className="text-sm text-muted-foreground"
>
← Back
</button>

<h2 className="text-3xl font-semibold">
Content Scheduler
</h2>

</div>

{/* Schedule form */}

<div className="grid md:grid-cols-4 gap-4">

<input
placeholder="Content title"
value={title}
onChange={(e) => setTitle(e.target.value)}
className="border rounded-lg p-3"
/>

<input
type="date"
value={date}
onChange={(e) => setDate(e.target.value)}
className="border rounded-lg p-3"
/>

<input
type="time"
value={time}
onChange={(e) => setTime(e.target.value)}
className="border rounded-lg p-3"
/>

<select
value={platform}
onChange={(e) => setPlatform(e.target.value)}
className="border rounded-lg p-3"
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
className="bg-teal-500 text-white px-6 py-3 rounded-lg"
>
{loading ? "Scheduling..." : "Schedule Content"}
</button>

{/* Analytics */}

<div className="border rounded-xl p-6">

<h3 className="font-semibold mb-4">
Content Performance
</h3>

<div style={{ width: "100%", height: 250 }}>

<ResponsiveContainer>

<BarChart data={stats}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="name" />

<YAxis />

<Tooltip />

<Bar dataKey="value" />

</BarChart>

</ResponsiveContainer>

</div>

</div>

{/* Events */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{events.map((e) => (

<div
key={e.id}
className="border rounded-xl p-5 space-y-3"
>

<h3 className="font-semibold text-lg">
{e.title}
</h3>

<p>Platform: {e.platform}</p>

<p>Status: {e.status}</p>

<p>
Time: {new Date(e.time).toLocaleString()}
</p>

{e.status !== "completed" && (

<button
onClick={() => markCompleted(e.id)}
className="bg-green-500 text-white px-4 py-2 rounded"
>
Mark Completed
</button>

)}

</div>

))}

</div>

</div>

)

}