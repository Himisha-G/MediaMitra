"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Flame, RotateCcw } from "lucide-react"
import { fetchAuthSession } from "aws-amplify/auth"

const API = process.env.NEXT_PUBLIC_EVENTS_API_CHT || ""

export function ChallengeTracker({ goBack }: { goBack: () => void }) {

const [progress,setProgress] = useState<number[]>([])
const [streak,setStreak] = useState<number>(0)
const [loading,setLoading] = useState(false)

useEffect(()=>{
fetchChallenge()
},[])

async function getToken(){

const session = await fetchAuthSession()
return session.tokens?.idToken?.toString()

}

async function fetchChallenge(){

try{

const token = await getToken()

const res = await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({ action:"get" })
})

const data = await res.json()

if(!data.progress){

console.log("No challenge found → creating one")

await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({ action:"start" })
})

return
}

setProgress(data.progress)
setStreak(data.streak)

}catch(err){
console.error("Failed loading challenge",err)
}

}

async function markToday(){

setLoading(true)

try{

const token = await getToken()

await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({ action:"update" })
})

await fetchChallenge()

}catch(err){
console.error("Update failed",err)
}

setLoading(false)

}

async function resetChallenge(){

try{

const token = await getToken()

await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({ action:"reset" })
})

await fetchChallenge()

}catch(err){
console.error("Reset failed",err)
}

}

/* ---------------- UI helpers ---------------- */

const completedDays = progress.filter(d=>d===1).length
const percent = Math.round((completedDays/30)*100)

const todayIndex = progress.findIndex((d)=>d===0)

function getMotivation(){

    const messages = [
    
    "Day 1 — Every streak starts with a single decision. You showed up.",
    "Day 2 — Consistency begins when motivation fades. Keep going.",
    "Day 3 — Three days in. You're already ahead of most people.",
    "Day 4 — Small actions repeated daily create big outcomes.",
    "Day 5 — Five days strong. Discipline is starting to form.",
    "Day 6 — Progress isn’t loud. It’s quiet consistency like this.",
    "Day 7 — One full week. That’s real momentum.",
    "Day 8 — This is where habits begin to stick.",
    "Day 9 — Most people quit around here. You're still here.",
    "Day 10 — Double digits. Your future self will thank you.",
    "Day 11 — Consistency compounds. Don’t break the chain.",
    "Day 12 — Twelve days of proof that you can commit.",
    "Day 13 — You're building a system, not chasing motivation.",
    "Day 14 — Two weeks. That's discipline taking shape.",
    "Day 15 — Halfway to 30. Stay locked in.",
    "Day 16 — Momentum is powerful now. Protect it.",
    "Day 17 — At this point, quitting would feel strange.",
    "Day 18 — The habit is becoming part of you.",
    "Day 19 — You're doing what most people never do: persist.",
    "Day 20 — Twenty days. That's elite consistency.",
    "Day 21 — Three weeks. Research says habits start forming here.",
    "Day 22 — You’ve already beaten your past self.",
    "Day 23 — Every day now is proof of discipline.",
    "Day 24 — The finish line is getting closer.",
    "Day 25 — Most streaks never reach this far.",
    "Day 26 — You’re operating on pure discipline now.",
    "Day 27 — Almost there. Don't slow down.",
    "Day 28 — Just two more days. Stay focused.",
    "Day 29 — One final push. You've earned this.",
    "Day 30 — Challenge complete. You built real consistency."
    
    ]
    
    return messages[Math.min(streak,29)]
    
    }

return(

<div className="max-w-4xl mx-auto px-6 py-8">

{/* HEADER */}

<div className="flex items-center justify-between mb-10">

<button
onClick={goBack}
className="flex items-center gap-2 text-muted-foreground hover:text-white transition"
>
<ArrowLeft size={16}/>
Back
</button>

<h2 className="text-3xl font-semibold">
Consistency Challenge
</h2>

</div>


{/* STREAK */}

<div className="flex items-center gap-3 mb-6 text-orange-400">

<div className="p-2 rounded-lg bg-orange-500/10">
<Flame size={20}/>
</div>

<div>

<p className="text-lg font-semibold">
{streak} Day Streak
</p>

<p className="text-xs text-muted-foreground">
Don't break the chain
</p>

</div>

</div>


{/* MOTIVATION CARD */}

<div className="mb-8 p-5 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">

<p className="text-lg font-medium text-white">
{getMotivation()}
</p>

<p className="text-sm text-muted-foreground mt-1">
Stay consistent. Small daily wins compound.
</p>

</div>


{/* PROGRESS BAR */}

<div className="mb-10">

<div className="flex justify-between text-sm mb-2 text-muted-foreground">
<span>{completedDays}/30 days completed</span>
<span>{percent}%</span>
</div>

<div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">

<div
className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
style={{ width: `${percent}%` }}
/>

</div>

</div>


{/* GRID */}

<div className="grid grid-cols-7 gap-x-1.5 gap-y-3 mb-10">

{Array.from({length:30}).map((_,i)=>{

const completed = progress[i] === 1
const isToday = i === todayIndex

return(

<div
key={i}
className={`h-14 w-14 rounded-xl flex items-center justify-center text-sm font-semibold transition transform hover:scale-105

${completed
? "bg-green-500 text-white shadow-lg shadow-green-500/30"
: "bg-gray-800 border border-gray-700 hover:border-gray-500"}

${isToday ? "ring-2 ring-green-500" : ""}
`}
>

{completed ? "✓" : i+1}

</div>

)

})}

</div>


{/* ACTION BUTTONS */}

<div className="flex gap-4">

<button
onClick={markToday}
disabled={loading}
className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition"
>

{loading ? "Updating..." : "Mark Today Done"}

</button>


<button
onClick={resetChallenge}
className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-muted transition"
>

<RotateCcw size={16}/>
Reset

</button>

</div>

</div>

)

}