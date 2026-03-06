import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const userId = searchParams.get("user_id")

  const client_id = process.env.GOOGLE_CLIENT_ID

  const FRONTEND_URL = process.env.FRONTEND_URL

  const redirect_uri = `${FRONTEND_URL}/api/youtube/callback`

  /* IMPORTANT: add analytics scope */

  const scope =
  "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly"

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${client_id}` +
    `&redirect_uri=${redirect_uri}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=consent` +
    `&state=${userId}`

  return NextResponse.redirect(url)

}