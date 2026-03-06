import { NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: "ap-southeast-2"
})

const docClient = DynamoDBDocumentClient.from(client)

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const userId = searchParams.get("user_id")

  const result = await docClient.send(
    new GetCommand({
      TableName: "youtube_connections",
      Key: {
        user_id: userId
      }
    })
  )

  if (result.Item) {
    return NextResponse.json({ connected: true })
  }

  return NextResponse.json({ connected: false })
}