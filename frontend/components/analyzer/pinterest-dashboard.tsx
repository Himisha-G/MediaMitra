"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const trendData = [
  { month: "Jan 2026", engagement: 3200 },
  { month: "Feb 2026", engagement: 4100 },
  { month: "Mar 2026", engagement: 5300 },
]

const topicData = [
  { name: "Home Decor", value: 35 },
  { name: "DIY", value: 25 },
  { name: "Fashion", value: 20 },
  { name: "Food", value: 12 },
  { name: "Wellness", value: 8 },
]

const COLORS = [
  "#ec4899",
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#14b8a6"
]

const products = [
  {
    month: "January 2026",
    items: [
      "Maximalist Home Decor",
      "3D Printed Jewelry",
      "Circus Aesthetic Posters"
    ]
  },
  {
    month: "February 2026",
    items: [
      "Gummy Pop Nail Art",
      "African Boho Living Rooms",
      "Retro Futurism Lamps"
    ]
  },
  {
    month: "March 2026",
    items: [
      "DIY Clay Decorations",
      "Bold Golden Jewelry",
      "Mystical Travel Boards"
    ]
  }
]

const creators = [
  "Mary Ann Rizzo",
  "Bailey Sarian",
  "Joy Cho (Oh Joy!)",
  "Kristy's Keto Lifestyle"
]

const indianCreators = [
  { name: "Aarti Madan", niche: "DIY & Crafts" },
  { name: "Shruti Arjun Anand", niche: "Beauty & Lifestyle" },
  { name: "Ankita Chaturvedi (Corallista)", niche: "Fashion & Beauty" },
  { name: "Kabita Singh", niche: "Food Recipes" },
  { name: "Shivesh Bhatia", niche: "Baking & Desserts" }
]

export function PinterestDashboard({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-6 py-10 space-y-8">
<button
  onClick={onBack}
  className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-white transition"
>
  ← Back to Analyzer
</button>
      <h1 className="text-3xl font-bold">
        Pinterest Trend Analytics
      </h1>

      {/* Engagement Chart */}

      <Card>
        <CardHeader>
          <CardTitle>Engagement Growth (2026)</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#ec4899"
                fill="#ec4899"
              />
            </AreaChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

      {/* Viral Topics Pie Chart */}

      <Card>
        <CardHeader>
          <CardTitle>Most Viral Pinterest Topics</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>

              <Pie
                data={topicData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={({ name }) => name}  // permanent labels
              >

                {topicData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

      {/* Trending Products */}

      <Card>
        <CardHeader>
          <CardTitle>Trending Products (2026)</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-6">

          {products.map((month) => (
            <div
              key={month.month}
              className="p-4 border rounded-lg hover:border-pink-500 transition"
            >
              <h3 className="font-semibold mb-2">
                {month.month}
              </h3>

              <ul className="text-sm space-y-1">
                {month.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

            </div>
          ))}

        </CardContent>
      </Card>

      {/* Global Creators */}

      <Card>
        <CardHeader>
          <CardTitle>Top Pinterest Creators (Global)</CardTitle>
        </CardHeader>

        <CardContent>

          <ul className="space-y-2 text-sm">
            {creators.map((creator) => (
              <li key={creator} className="border-b pb-1">
                {creator}
              </li>
            ))}
          </ul>

        </CardContent>
      </Card>

      {/* Indian Creators */}

      <Card>
        <CardHeader>
          <CardTitle>Top Indian Pinterest Creators</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid md:grid-cols-2 gap-4">

            {indianCreators.map((creator) => (
              <div
                key={creator.name}
                className="p-3 border rounded-lg hover:border-green-500 transition"
              >
                <p className="font-medium">{creator.name}</p>
                <p className="text-sm text-muted-foreground">
                  Niche: {creator.niche}
                </p>
              </div>
            ))}

          </div>

        </CardContent>
      </Card>

    </div>
  )
}