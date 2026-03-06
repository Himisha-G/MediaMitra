import { NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"


const client = new DynamoDBClient({
    region: "ap-southeast-2"
  })
  
  const docClient = DynamoDBDocumentClient.from(client)

const FRONTEND_URL = process.env.FRONTEND_URL


export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const code = searchParams.get("code")
  const userId = searchParams.get("state")
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code: code || "",
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: `${FRONTEND_URL}/api/youtube/callback`,
      grant_type: "authorization_code"
    })
  })

  const tokens = await tokenRes.json()
  await docClient.send(
    new PutCommand({
      TableName: "youtube_connections",
      Item: {
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry: Date.now() + tokens.expires_in * 1000
      }
    })
  )

  console.log("TOKENS:", tokens)

  return NextResponse.redirect(
    new URL("/analyzer?yt=connected", req.url)
  )
}