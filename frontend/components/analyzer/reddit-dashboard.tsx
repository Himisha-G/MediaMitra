"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const redditData = [
  { subreddit: "AI", mentions: 420 },
  { subreddit: "MachineLearning", mentions: 310 },
  { subreddit: "Startups", mentions: 210 },
  { subreddit: "Tech", mentions: 280 },
]

export function RedditDashboard() {
  return (
    <div className="px-6 py-8">

      <h1 className="text-3xl font-bold mb-6">
        Reddit Analysis
      </h1>

      <Card>

        <CardHeader>
          <CardTitle>Subreddit Mentions</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={redditData}>
              <XAxis dataKey="subreddit"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="mentions" fill="#8b5cf6"/>
            </BarChart>
          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>
  )
}