import { NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  GetCommand
} from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: "ap-southeast-2"
})

const docClient = DynamoDBDocumentClient.from(client)

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }

    /* ---------------------------
       GET ACCESS TOKEN
    ---------------------------- */

    const result = await docClient.send(
      new GetCommand({
        TableName: "youtube_connections",
        Key: { user_id: userId }
      })
    )

    if (!result.Item) {
      return NextResponse.json({ error: "YouTube not connected" }, { status: 400 })
    }

    const accessToken = result.Item.access_token

    /* ---------------------------
       CHANNEL STATS
    ---------------------------- */

    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    const channelData = await channelRes.json()

    const stats = channelData.items?.[0]?.statistics || {
      subscriberCount: 0,
      viewCount: 0,
      videoCount: 0
    }

    /* ---------------------------
       VIDEO LIST
    ---------------------------- */

    const searchRes = await fetch(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    const searchData = await searchRes.json()

    let videos = searchData.items || []

    /* ---------------------------
       GET VIDEO STATISTICS
    ---------------------------- */

    const videoIds = videos.map((v: any) => v.id.videoId).join(",")

    if (videoIds) {

      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      const statsData = await statsRes.json()

      videos = videos.map((v: any, i: number) => ({
        ...v,
        statistics: statsData.items?.[i]?.statistics || {
          viewCount: 0,
          likeCount: 0
        }
      }))
    }

    /* ---------------------------
       ANALYTICS API
       Views per day
    ---------------------------- */

    const today = new Date().toISOString().split("T")[0]

    const analyticsUrl =
      `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2024-01-01&endDate=${today}&metrics=views&dimensions=day`

    const analyticsRes = await fetch(analyticsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const analyticsData = await analyticsRes.json()

    let history: any[] = []

    if (analyticsData.rows) {

      history = analyticsData.rows.map((row: any) => ({
        date: row[0],
        views: row[1]
      }))

    }

    /* ---------------------------
       AI SUGGESTIONS
    ---------------------------- */

    let suggestions = "AI suggestions unavailable"

    try {

      if (videos.length > 0 && process.env.AI_LAMBDA_URL) {

        const aiRes = await fetch(process.env.AI_LAMBDA_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            videos
          })
        })

        const aiData = await aiRes.json()

        suggestions = aiData.suggestions || suggestions

      }

    } catch (err) {

      console.log("AI error:", err)

    }

    /* ---------------------------
       RESPONSE
    ---------------------------- */

    return NextResponse.json({
      stats,
      videos,
      history,
      suggestions
    })

  } catch (err) {

    console.error("Analytics route error:", err)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )

  }

}