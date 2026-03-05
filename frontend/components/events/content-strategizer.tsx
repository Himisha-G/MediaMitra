"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

const API = process.env.NEXT_PUBLIC_EVENTS_API!

export function ContentStrategizer({goBack}:{goBack:()=>void}) {

  const [topic,setTopic] = useState("")
  const [platform,setPlatform] = useState("YouTube")
  const [result,setResult] = useState("")

  async function analyze(){

    const res = await fetch(`${API}/ai`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        topic,
        platform
      })
    })

    const data = await res.json()

    setResult(data.ai)
  }

  return (
    <div className="px-6 py-8">

      <button onClick={goBack} className="mb-6">
        <ArrowLeft size={16}/> Back
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Content Strategizer
      </h2>

      <div className="grid gap-3 max-w-md">

        <input
          placeholder="Topic"
          value={topic}
          onChange={e=>setTopic(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={platform}
          onChange={e=>setPlatform(e.target.value)}
          className="border p-2 rounded"
        >
          <option>YouTube</option>
          <option>Instagram</option>
          <option>Shorts</option>
        </select>

        <button
          onClick={analyze}
          className="bg-primary text-white p-2 rounded"
        >
          Generate AI Strategy
        </button>

      </div>

      {result && (
        <div className="mt-6 border p-4 rounded whitespace-pre-wrap">
          {result}
        </div>
      )}

    </div>
  )
}