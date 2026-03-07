"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"



const subredditData = [
  { name: "r/india", members: "2M+", niche: "News & Discussion" },
  { name: "r/developersIndia", members: "600K+", niche: "Programming" },
  { name: "r/IndianGaming", members: "300K+", niche: "Gaming" },
  { name: "r/bollywood", members: "250K+", niche: "Entertainment" },
  { name: "r/IndianStartups", members: "150K+", niche: "Entrepreneurship" }
]


const postTypeData = [
  { type: "Memes", upvotes: 12000 },
  { type: "Discussion", upvotes: 8000 },
  { type: "News", upvotes: 6500 },
  { type: "Questions", upvotes: 5200 },
  { type: "Tutorials", upvotes: 4200 }
]


const growthCommunities = [
  { name: "r/ChatGPT", growth: "+220%" },
  { name: "r/IndianStartups", growth: "+160%" },
  { name: "r/SideProject", growth: "+120%" },
  { name: "r/AItools", growth: "+190%" },
  { name: "r/WebDev", growth: "+140%" }
]


const topicData = [
  { name: "AI / Tech", value: 30 },
  { name: "Relationships", value: 20 },
  { name: "Personal Growth", value: 18 },
  { name: "Programming", value: 17 },
  { name: "Memes", value: 15 }
]

const COLORS = [
  "#6366f1",
  "#ec4899",
  "#22c55e",
  "#f59e0b",
  "#06b6d4"
]


const discussionGrowth = [
  { month: "Jan", posts: 8000 },
  { month: "Feb", posts: 12000 },
  { month: "Mar", posts: 15000 }
]


const influencers = [
  { name: "u/deepfuckingvalue", niche: "Finance / Investing" },
  { name: "u/gallowboob", niche: "Viral Content" },
  { name: "u/IndianTechGuide", niche: "Technology Discussions" },
  { name: "u/AskHistoriansMods", niche: "Education / History" },
  { name: "u/spez", niche: "Platform Administration" }
]



export function RedditDashboard({ onBack }: { onBack: () => void }) {

  return (
    <div className="px-6 py-10 space-y-8">
<button
  onClick={onBack}
  className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-white transition"
>
  ← Back to Analyzer
</button>
      <h1 className="text-3xl font-bold">
        Reddit Community Insights
      </h1>

      <p className="text-muted-foreground">
        Community-driven analysis of subreddit growth, discussion topics and viral post formats.
      </p>



      {/* Top Indian Subreddits */}

      <Card>
        <CardHeader>
          <CardTitle>Top Indian Subreddits</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">

          {subredditData.map((sub) => (
            <div
              key={sub.name}
              className="p-4 border rounded-lg hover:border-orange-500 transition"
            >
              <p className="font-semibold">{sub.name}</p>
              <p className="text-sm text-muted-foreground">
                Members: {sub.members}
              </p>
              <p className="text-sm text-muted-foreground">
                Niche: {sub.niche}
              </p>
            </div>
          ))}

        </CardContent>
      </Card>



      {/* Viral Post Formats */}

      <Card>
        <CardHeader>
          <CardTitle>Most Upvoted Post Formats</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postTypeData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="upvotes" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>



      {/* Fastest Growing Communities */}

      <Card>
        <CardHeader>
          <CardTitle>Fastest Growing Communities</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-4">

          {growthCommunities.map((sub) => (
            <div
              key={sub.name}
              className="p-4 border rounded-lg hover:border-blue-500 transition"
            >
              <p className="font-semibold">{sub.name}</p>
              <p className="text-sm text-muted-foreground">
                Growth: {sub.growth}
              </p>
            </div>
          ))}

        </CardContent>
      </Card>



      {/* Most Discussed Topics */}

      <Card>
        <CardHeader>
          <CardTitle>Most Discussed Topics</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>

              <Pie
                data={topicData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={({ name }) => name}
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



      {/* Discussion Growth */}

      <Card>
        <CardHeader>
          <CardTitle>Reddit Discussion Growth</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={discussionGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="posts"
                stroke="#8b5cf6"
                fill="#8b5cf6"
              />
            </AreaChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>



      {/* Influential Reddit Users */}

      <Card>
        <CardHeader>
          <CardTitle>Influential Reddit Users</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">

          {influencers.map((user) => (
            <div
              key={user.name}
              className="p-3 border rounded-lg hover:border-green-500 transition"
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                Known For: {user.niche}
              </p>
            </div>
          ))}

        </CardContent>
      </Card>

    </div>
  )
}