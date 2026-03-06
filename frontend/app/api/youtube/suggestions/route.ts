import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const res = await fetch(process.env.AI_LAMBDA_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    return NextResponse.json({
      suggestions: data.suggestions
    })

  } catch (err) {

    console.error("Suggestions error:", err)

    return NextResponse.json({
      suggestions: "AI suggestions unavailable"
    })

  }

}