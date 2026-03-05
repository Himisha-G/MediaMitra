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
    
    return   // ❗ stop recursion
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
Authorization: token!
},
body: JSON.stringify({ action:"reset" })
})

await fetchChallenge()

}catch(err){
console.error("Reset failed",err)
}

}


return(

<div className="max-w-4xl mx-auto px-6 py-8">

{/* HEADER */}

<div className="flex items-center justify-between mb-8">

<button
onClick={goBack}
className="flex items-center gap-2 text-muted-foreground hover:text-white"
>
<ArrowLeft size={16}/>
Back
</button>

<h2 className="text-3xl font-semibold">
Consistency Challenge
</h2>

</div>


{/* STREAK */}

<div className="flex items-center gap-3 mb-8 text-orange-400 text-lg font-semibold">

<Flame/>

{streak} day streak

</div>


{/* GRID */}

<div className="grid grid-cols-7 gap-4 mb-8">

{Array.from({length:30}).map((_,i)=>{

const completed = progress[i] === 1

return(

<div
key={i}
className={`h-14 w-14 rounded-xl flex items-center justify-center text-sm font-semibold transition
${completed
? "bg-green-500 text-white shadow-lg shadow-green-500/30"
: "bg-gray-800 border border-gray-700 hover:border-gray-500"}
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
className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-muted"
>
<RotateCcw size={16}/>
Reset
</button>

</div>

</div>

)

}