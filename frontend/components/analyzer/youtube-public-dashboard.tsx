"use client"

import { useState } from "react"
import axios from "axios"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts"

export function YoutubePublicDashboard(){

const [url,setUrl]=useState("")
const [data,setData]=useState<any>(null)
const [metadata,setMetadata]=useState<any>(null)
const [loading,setLoading]=useState(false)
const [creatorTips,setCreatorTips]=useState<string[]>([])

const analyze=async()=>{

setLoading(true)

try{

const res=await axios.post(
process.env.NEXT_PUBLIC_ANALYZER_API!,
{video_url:url}
)

setMetadata(res.data.metadata)
setData(res.data.analysis)
setCreatorTips(res.data.creator_advice || [])

}catch(e){
console.error(e)
}

setLoading(false)

}

return(

<div className="space-y-8">

<div className="flex gap-3">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube URL"
className="border p-2 w-full rounded"
/>

<button
onClick={analyze}
className="bg-primary px-4 py-2 rounded text-white"
>
Analyze
</button>

</div>


{metadata &&(

<div className="border rounded-lg p-4">

<img
src={metadata.thumbnail}
className="w-64 rounded"
/>

<h2 className="text-lg font-bold mt-2">
{metadata.title}
</h2>

<div className="text-sm mt-2">

Channel: {metadata.channel}
<br/>
Views: {metadata.views}
<br/>
Likes: {metadata.likes}
<br/>
Comments: {metadata.comments}

</div>

</div>

)}


{loading && <p>Analyzing video...</p>}



{data &&(

<>

<div className="grid grid-cols-2 gap-8">

<div>

<h3>Engagement Score</h3>

<div className="text-4xl font-bold">
{data?.content_signals?.engagement_score || 0}/100
</div>

</div>


<div>

<h3>Performance Grade</h3>

<div className="text-2xl bg-green-600 inline-block px-3 py-1 rounded">
{data?.dashboard_metrics?.performance_grade || "-"}
</div>

</div>



<div>

<h3>Sentiment</h3>

<ResponsiveContainer width="100%" height={250}>

<PieChart>

<Pie
data={[
{name:"Positive",value:data?.audience_analysis?.sentiment_distribution?.positive || 0},
{name:"Neutral",value:data?.audience_analysis?.sentiment_distribution?.neutral || 0},
{name:"Negative",value:data?.audience_analysis?.sentiment_distribution?.negative || 0}
]}
dataKey="value"
outerRadius={80}
>

<Cell fill="#22c55e"/>
<Cell fill="#eab308"/>
<Cell fill="#ef4444"/>

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>



<div>

<h3>Comment Categories</h3>

<ResponsiveContainer width="100%" height={250}>

<BarChart
data={[
{name:"Praise",value:data?.audience_analysis?.category_distribution?.Praise || 0},
{name:"Criticism",value:data?.audience_analysis?.category_distribution?.Criticism || 0},
{name:"Hate",value:data?.audience_analysis?.category_distribution?.Hate || 0},
{name:"Spam",value:data?.audience_analysis?.category_distribution?.Spam || 0}
]}
>

<XAxis dataKey="name"/>
<YAxis/>

<Bar dataKey="value" fill="#14b8a6"/>

</BarChart>

</ResponsiveContainer>

</div>



<div>

<h3>Community Health</h3>

<div className="text-3xl">
{data?.audience_analysis?.community_health_score || 0}/100
</div>

</div>



<div>

<h3>Virality Probability</h3>

<div className="w-full bg-gray-300 rounded h-4">

<div
className="bg-green-500 h-4 rounded"
style={{
width:`${data?.improvement_plan?.virality_probability_score || 0}%`
}}
/>

</div>

</div>

</div>



{/* Creator Tips */}

{creatorTips.length > 0 &&(

<div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6 mt-8">

<h2 className="text-lg font-semibold mb-4 text-white">
Creator Improvement Tips
</h2>

<ul className="space-y-3">

{creatorTips.map((tip,index)=>(
<li
key={index}
className="flex items-start gap-3 text-gray-300"
>

<span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
{index+1}
</span>

<span>{tip}</span>

</li>
))}

</ul>

</div>

)}

</>

)}

</div>

)

}