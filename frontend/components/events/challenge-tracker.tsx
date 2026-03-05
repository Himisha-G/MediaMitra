"use client"

import { ArrowLeft } from "lucide-react"

export function ChallengeTracker({goBack}:{goBack:()=>void}) {

  const days = Array.from({length:30})

  return (
    <div className="px-6 py-8">

      <button onClick={goBack} className="mb-6">
        <ArrowLeft size={16}/> Back
      </button>

      <h2 className="text-2xl font-bold mb-6">
        30 Day Consistency Challenge
      </h2>

      <div className="grid grid-cols-6 gap-3 max-w-lg">

        {days.map((_,i)=>(
          <div
            key={i}
            className="h-12 rounded bg-muted flex items-center justify-center"
          >
            {i+1}
          </div>
        ))}

      </div>

    </div>
  )
}