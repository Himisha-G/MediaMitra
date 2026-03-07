"use client"

import { ArrowLeft } from "lucide-react"
import {
ResponsiveContainer,
PieChart,
Pie,
Cell,
Tooltip,
ScatterChart,
Scatter,
XAxis,
YAxis
} from "recharts"

export function InstagramDashboard({ onBack }: { onBack: () => void }) {

const hashtagCategories = [
{ name: "General Viral", value: 40 },
{ name: "Fitness", value: 25 },
{ name: "Reels Growth", value: 20 },
{ name: "Fashion", value: 10 },
{ name: "Business", value: 5 }
]

const topics = [
{ x: 10, y: 30, z: 200, topic: "Holi Content" },
{ x: 20, y: 25, z: 180, topic: "Cricket Videos" },
{ x: 30, y: 40, z: 220, topic: "Bollywood News" },
{ x: 40, y: 20, z: 150, topic: "Music Reels" },
{ x: 50, y: 35, z: 170, topic: "Local Viral Stories" }
]

const COLORS = [
"#E1306C",
"#F77737",
"#C13584",
"#833AB4",
"#405DE6"
]

return (

<div className="px-6 py-10 space-y-10 max-w-6xl mx-auto">

{/* Back Button */}

<button
onClick={onBack}
className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition"
>
<ArrowLeft size={16}/>
Back to Analyzer
</button>

<h1 className="text-3xl font-bold">
Instagram Trends Dashboard
</h1>

{/* Top Creators */}

<div className="bg-card rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Top Instagram Creators (India)
</h2>

{[
{ name: "Virat Kohli", followers: "275M" },
{ name: "Narendra Modi", followers: "100M" },
{ name: "Shraddha Kapoor", followers: "95M" },
{ name: "Priyanka Chopra", followers: "93M" },
{ name: "Alia Bhatt", followers: "86M" },
{ name: "Deepika Padukone", followers: "80M" }
].map((creator, i) => (

<div
key={creator.name}
className="flex justify-between py-2 border-b border-muted"
>

<span>
{i + 1}. {creator.name}
</span>

<span className="text-muted-foreground">
{creator.followers}
</span>

</div>

))}

</div>


{/* Hashtag Chart */}

<div className="bg-card rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Trending Hashtag Categories
</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={hashtagCategories}
dataKey="value"
nameKey="name"
innerRadius={60}
outerRadius={100}
>

{hashtagCategories.map((entry, index) => (

<Cell key={index} fill={COLORS[index % COLORS.length]} />

))}

</Pie>

<Tooltip
formatter={(value, name) => [`${value}% of trending posts`, name]}
/>

</PieChart>

</ResponsiveContainer>


{/* Trending Hashtag Chips */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

{[
"#love",
"#fitness",
"#reels",
"#instagood",
"#explorepage",
"#fashion",
"#viral",
"#smallbusiness"
].map(tag => (

<div
key={tag}
className="bg-muted rounded-lg px-4 py-2 text-center hover:bg-primary/20 transition"
>

<span className="text-sm font-medium">
{tag}
</span>

</div>

))}

</div>

</div>


{/* Trending Topics Bubble Chart */}

<div className="bg-card rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Trending Instagram Topics
</h2>

<ResponsiveContainer width="100%" height={350}>

<ScatterChart>

<XAxis dataKey="x" name="Engagement"/>
<YAxis dataKey="y" name="Popularity"/>

<Tooltip
content={({ payload }) => {

if (!payload || !payload.length) return null

const data = payload[0].payload

return (

<div className="bg-black border border-gray-700 p-3 rounded-lg">

<p className="text-sm font-semibold">
{data.topic}
</p>

<p className="text-xs text-muted-foreground">
Virality Score: {data.z}
</p>

</div>

)

}}
/>

<Scatter
data={topics}
fill="#F77737"
/>

</ScatterChart>

</ResponsiveContainer>

</div>


{/* Insight Cards */}

<div className="grid md:grid-cols-3 gap-4">

<div className="bg-card p-4 rounded-lg">

<h3 className="text-sm text-muted-foreground">
Most Viral Topic
</h3>

<p className="text-lg font-semibold">
Bollywood News
</p>

</div>

<div className="bg-card p-4 rounded-lg">

<h3 className="text-sm text-muted-foreground">
Top Hashtag Category
</h3>

<p className="text-lg font-semibold">
General Viral
</p>

</div>

<div className="bg-card p-4 rounded-lg">

<h3 className="text-sm text-muted-foreground">
Fastest Growing Content
</h3>

<p className="text-lg font-semibold">
Reels + Fitness
</p>

</div>

</div>


{/* Reels Virality Score */}

<div className="bg-card rounded-xl p-6">

<h2 className="text-lg font-semibold mb-2">
Reels Virality Score
</h2>

<div className="text-5xl font-bold text-pink-500">
82%
</div>

<p className="text-sm text-muted-foreground mt-2">
Reels dominate Instagram engagement in India.
</p>

</div>

</div>

)

}