"use client"

import { useEffect, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"
import {
    PieChart,
    Pie,
    Cell
   } from "recharts"

export function YoutubePrivate(){

const [userId,setUserId] = useState<string|null>(null)
const [connected,setConnected] = useState(false)
const [data,setData] = useState<any>(null)
const [loading,setLoading] = useState(true)
const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6"]
useEffect(()=>{

async function init(){

const session = await fetchAuthSession()
const payload = session.tokens?.idToken?.payload
const sub = payload?.sub as string

if(!sub) return

setUserId(sub)

/* CHECK CONNECTION */

const statusRes = await fetch(`/api/youtube/status?user_id=${sub}`)
const status = await statusRes.json()

if(!status.connected){
setConnected(false)
setLoading(false)
return
}

setConnected(true)

/* LOAD ANALYTICS */

const analyticsRes = await fetch(`/api/youtube/analytics?user_id=${sub}`)
const analytics = await analyticsRes.json()

setData(analytics)
setLoading(false)

}

init()

},[])

const connectYoutube = ()=>{
if(!userId) return
window.location.href = `/api/youtube/auth?user_id=${userId}`
}

if(loading){
return <div className="p-6">Loading analytics...</div>
}

if(!connected){

return(

<div className="space-y-6">

<h2 className="text-2xl font-semibold">
Private YouTube Analytics
</h2>

<div className="border rounded-xl p-6 flex flex-col items-center gap-4">

<p className="text-muted-foreground">
Connect your YouTube channel to view private analytics
</p>

<button
onClick={connectYoutube}
className="bg-red-600 text-white px-6 py-3 rounded-lg"
>
Connect YouTube
</button>

</div>

</div>

)

}

const stats = data?.stats || {
subscriberCount:0,
viewCount:0,
videoCount:0
}

const videos = data?.videos || []
const history = data?.history || []

/* ENGAGEMENT RATE */

let totalLikes = 0
let totalViews = 0

videos.forEach((v:any)=>{
totalLikes += Number(v.statistics?.likeCount || 0)
totalViews += Number(v.statistics?.viewCount || 0)
})

const engagementRate =
totalViews > 0
? ((totalLikes/totalViews)*100).toFixed(2)
: "0"

/* CHART DATA */

const viewChart =
history.length > 0
? history.map((h:any)=>({
  date: new Date(h.date).toLocaleDateString(),
  value: Number(h.views)
}))
: [{
  date: "Today",
  value: Number(stats.viewCount)
}]

const subscriberChart = [
{
date:"Today",
value:Number(stats.subscriberCount)
}
]

const videoChart = [
{
date:"Today",
value:Number(stats.videoCount)
}
]

return(

<div className="space-y-8">

<h2 className="text-2xl font-semibold">
Private YouTube Analytics
</h2>

<div className="text-green-500 font-medium">
YouTube Connected ✅
</div>

<div className="grid md:grid-cols-4 gap-4">

<div className="border p-4 rounded-lg">
<h3 className="text-sm text-muted-foreground">Subscribers</h3>
<p className="text-2xl font-bold">{stats.subscriberCount}</p>
</div>

<div className="border p-4 rounded-lg">
<h3 className="text-sm text-muted-foreground"> Daily Views</h3>
<p className="text-2xl font-bold">{stats.viewCount}</p>
</div>

<div className="border p-4 rounded-lg">
<h3 className="text-sm text-muted-foreground">Videos</h3>
<p className="text-2xl font-bold">{stats.videoCount}</p>
</div>

<div className="border p-4 rounded-lg">
<h3 className="text-sm text-muted-foreground">Engagement Rate</h3>
<p className="text-2xl font-bold">{engagementRate}%</p>
</div>

</div>


<div className="grid md:grid-cols-3 gap-6">

<div className="border rounded-xl p-6">

<h3 className="mb-4 font-semibold">
Subscriber Growth
</h3>

<ResponsiveContainer width="100%" height={200}>

<LineChart data={subscriberChart}>

<XAxis dataKey="date" tick={{fontSize:10}} />
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#22c55e"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>


<div className="border rounded-xl p-6">

<h3 className="mb-4 font-semibold">
Views Growth
</h3>

<ResponsiveContainer width="100%" height={200}>

<LineChart data={viewChart}>

<XAxis dataKey="date"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#3b82f6"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>


<div className="border rounded-xl p-6">

<h3 className="mb-4 font-semibold">
Videos Uploaded
</h3>

<ResponsiveContainer width="100%" height={200}>

<LineChart data={videoChart}>

<XAxis dataKey="date"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#f59e0b"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>
<div className="grid md:grid-cols-2 gap-6">

{/* Traffic Sources */}

<div className="border rounded-xl p-6">

<h3 className="mb-4 font-semibold">
Traffic Sources
</h3>



<PieChart width={300} height={220}>
<Pie
 data={data?.trafficSources || []}
 dataKey="views"
 nameKey="source"
 outerRadius={80}
 label
>
{(data?.trafficSources || []).map((entry:any,index:number)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}
</Pie>
</PieChart>

</div>


{/* Device Type */}

<div className="border rounded-xl p-6">

<h3 className="mb-4 font-semibold">
Device Types
</h3>

<PieChart width={300} height={220}>
<Pie
 data={data?.devices || []}
 dataKey="views"
 nameKey="device"
 outerRadius={80}
 label
>
{(data?.devices || []).map((entry:any,index:number)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}
</Pie>
</PieChart>

</div>

</div>

<div className="border rounded-xl p-6">

<h3 className="mb-6 font-semibold">
Recent Videos
</h3>

<div className="grid md:grid-cols-2 gap-6">

{videos.map((video:any)=>{

const id = video.id || video.id?.videoId

return(

<div
key={id}
className="flex gap-4 border rounded-lg p-3"
>

<img
src={video.snippet.thumbnails.medium.url}
className="rounded-lg w-40"
/>

<div>

<p className="font-medium">
{video.snippet.title}
</p>

<p className="text-sm text-muted-foreground">
{video.statistics?.viewCount || 0} views
</p>

</div>

</div>

)

})}

</div>

</div>


<div className="border rounded-xl p-6">

<h3 className="mb-3 font-semibold">
AI Content Suggestions
</h3>

<div className="text-sm leading-relaxed space-y-2">
  {data?.suggestions?.split("\n").map((line: string, i: number) => (
    <p key={i}>{line}</p>
  )) || "AI suggestions unavailable"}
</div>

</div>

</div>

)

}