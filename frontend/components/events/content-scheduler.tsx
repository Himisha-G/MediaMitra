"use client"
import { Cell } from "recharts"
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

import GaugeComponent from "react-gauge-component"

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

const res = await fetch(API,{
headers:{ Authorization: token! }
})

const data = await res.json()

let parsed: EventItem[] = []

if(Array.isArray(data)) parsed = data
else if(data.body) parsed = JSON.parse(data.body)

const now = new Date()

parsed = parsed.map(e => {

if(e.status === "completed") return e

if(new Date(e.time) < now) {
return {...e,status:"missed"}
}

return e

})

setEvents(parsed)

} catch(err){
console.error(err)
}

}

async function createEvent(){

if(!title || !date || !time){
alert("Fill all fields")
return
}

setLoading(true)

try{

const session = await fetchAuthSession()
const token = session.tokens?.idToken?.toString()

const isoTime = new Date(`${date}T${time}`).toISOString()

await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:token!
},
body:JSON.stringify({
title,
platform,
time:isoTime
})
})

setTitle("")
setDate("")
setTime("")

await loadEvents()

}catch(err){
console.error(err)
}

setLoading(false)

}

function markCompleted(id:string){

setEvents(prev =>
prev.map(e =>
e.id === id
? {...e,status:"completed"}
: e
)
)

}

const stats = useMemo(()=>{

let completed=0
let missed=0
let scheduled=0

events.forEach(e=>{
if(e.status==="completed") completed++
else if(e.status==="missed") missed++
else scheduled++
})

return[
{name:"missed",value:missed},
{name:"completed",value:completed},
{name:"scheduled",value:scheduled}
]

},[events])

const burnoutScore = useMemo(()=>{

if(events.length===0) return 20

const missed = stats[0].value
const completed = stats[1].value

const ratio = completed / (completed + missed + 1)

return Math.round((1-ratio)*100)

},[stats,events])

const consistencyScore = useMemo(()=>{

if(events.length===0) return 0

const completed = stats[1].value

return Math.round((completed/events.length)*100)

},[events,stats])

function statusColor(status:string){

if(status==="completed") return "bg-green-500/20 text-green-400"
if(status==="missed") return "bg-red-500/20 text-red-400"
return "bg-yellow-500/20 text-yellow-400"

}

function platformColor(platform:string){

if(platform==="YouTube") return "bg-red-500/20 text-red-400"
if(platform==="Instagram") return "bg-pink-500/20 text-pink-400"
if(platform==="Shorts") return "bg-yellow-500/20 text-yellow-400"
if(platform==="TikTok") return "bg-cyan-500/20 text-cyan-400"

return "bg-gray-500/20 text-gray-400"

}

return(

<div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

{/* HEADER */}

<div className="flex items-center justify-between">

<button
onClick={goBack}
className="text-sm text-muted-foreground hover:text-white"
>
← Back
</button>

<h2 className="text-3xl font-semibold">
Content Scheduler
</h2>

</div>


{/* CREATE EVENT */}

<div className="bg-card border rounded-xl p-6 space-y-4">

<h3 className="text-lg font-semibold">
Schedule New Content
</h3>

<div className="grid md:grid-cols-4 gap-4">

<input
placeholder="Content title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border rounded-lg p-3 bg-background"
/>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border rounded-lg p-3 bg-background"
/>

<input
type="time"
value={time}
onChange={(e)=>setTime(e.target.value)}
className="border rounded-lg p-3 bg-background"
/>

<select
value={platform}
onChange={(e)=>setPlatform(e.target.value)}
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
className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
>
{loading?"Scheduling...":"Schedule Content"}
</button>

</div>


{/* UPCOMING CONTENT */}

<div>

<h3 className="text-lg font-semibold mb-4">
Upcoming Content
</h3>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

{events.map(e=>(

<div
key={e.id}
className="border rounded-xl p-5 bg-card hover:border-primary transition"
>

<h4 className="font-semibold text-lg mb-3">
{e.title}
</h4>

<div className="flex justify-between mb-3">

<span className={`text-xs px-3 py-1 rounded-full ${platformColor(e.platform)}`}>
{e.platform}
</span>

<span className={`text-xs px-3 py-1 rounded-full ${statusColor(e.status)}`}>
{e.status}
</span>

</div>

<p className="text-sm text-muted-foreground mb-4">

{new Date(e.time).toLocaleString(undefined,{
dateStyle:"medium",
timeStyle:"short"
})}

</p>

{e.status!=="completed" && (

<button
onClick={()=>markCompleted(e.id)}
className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg"
>
Mark Completed
</button>

)}

</div>

))}

</div>

</div>


{/* ANALYTICS */}

<div className="grid md:grid-cols-3 gap-6">

{/* BAR CHART */}

<div className="bg-card border rounded-xl p-6 md:col-span-2">

<h3 className="font-semibold mb-4">
Content Performance
</h3>

<div style={{width:"50%",height:260}}>

<ResponsiveContainer>

<BarChart
data={stats}
margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
>

<defs>

<linearGradient id="missed" x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
<stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
</linearGradient>

<linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopColor="#22c55e" stopOpacity={0.9}/>
<stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
</linearGradient>

<linearGradient id="scheduled" x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopColor="#facc15" stopOpacity={0.9}/>
<stop offset="95%" stopColor="#facc15" stopOpacity={0.2}/>
</linearGradient>

</defs>

<CartesianGrid
strokeDasharray="3 3"
stroke="#444"
/>

<XAxis
dataKey="name"
tick={{ fill: "#9ca3af" }}
axisLine={false}
tickLine={false}
/>

<YAxis
tick={{ fill: "#9ca3af" }}
axisLine={false}
tickLine={false}
/>

<Tooltip
contentStyle={{
background:"#111",
border:"1px solid #333",
borderRadius:"8px"
}}
/>

<Bar
dataKey="value"
radius={[6,6,0,0]}
animationDuration={800}
>

{stats.map((entry, index) => {

let fill = "url(#scheduled)"

if(entry.name === "missed") fill = "url(#missed)"
if(entry.name === "completed") fill = "url(#completed)"

return <Cell key={index} fill={fill} />

})}

</Bar>

</BarChart>

</ResponsiveContainer>

</div>

</div>


{/* BURNOUT GAUGE */}

<div className="bg-card border rounded-xl p-6 flex flex-col items-center">

<h3 className="font-semibold mb-4">
Burnout Risk
</h3>

<GaugeComponent
value={burnoutScore}
type="semicircle"
arc={{
colorArray:["#22c55e","#facc15","#ef4444"],
padding:0.02,
subArcs:[{limit:30},{limit:70},{}]
}}
pointer={{elastic:true}}
labels={{valueLabel:{formatTextValue:v=>v+"%"}}}
/>

</div>

</div>


{/* CONSISTENCY */}

<div className="bg-card border rounded-xl p-6">

<h3 className="font-semibold mb-3">
Consistency Score
</h3>

<div className="flex items-center gap-6">

<div className="text-3xl font-bold">
{consistencyScore}
</div>

<div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">

<div
className="h-full bg-green-500"
style={{width:`${consistencyScore}%`}}
/>

</div>

</div>

</div>

</div>

)

}