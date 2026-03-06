"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const reelData = [
  { day: "Mon", views: 1200 },
  { day: "Tue", views: 2200 },
  { day: "Wed", views: 3400 },
  { day: "Thu", views: 2900 },
  { day: "Fri", views: 4200 },
]

export function InstagramDashboard() {
  return (
    <div className="px-6 py-8">

      <h1 className="text-3xl font-bold mb-6">
        Instagram Analysis
      </h1>

      <Card>

        <CardHeader>
          <CardTitle>Reel Performance</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reelData}>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>
              <Area
                type="monotone"
                dataKey="views"
                stroke="#ec4899"
                fill="#ec4899"
              />
            </AreaChart>
          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>
  )
}