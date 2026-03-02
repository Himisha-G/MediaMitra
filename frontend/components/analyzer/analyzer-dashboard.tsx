"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { TrendingUp, Users, Eye, Heart, Share2, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const engagementData = [
  { month: "Jan", likes: 4000, shares: 2400, comments: 1800 },
  { month: "Feb", likes: 3000, shares: 1398, comments: 2210 },
  { month: "Mar", likes: 5000, shares: 3800, comments: 2290 },
  { month: "Apr", likes: 4780, shares: 3908, comments: 2000 },
  { month: "May", likes: 5890, shares: 4800, comments: 2181 },
  { month: "Jun", likes: 6390, shares: 3800, comments: 2500 },
]

const audienceGrowthData = [
  { month: "Jan", followers: 1200 },
  { month: "Feb", followers: 1900 },
  { month: "Mar", followers: 2800 },
  { month: "Apr", followers: 3900 },
  { month: "May", followers: 5200 },
  { month: "Jun", followers: 7100 },
]

const platformData = [
  { name: "YouTube", value: 40, color: "var(--chart-1)" },
  { name: "Instagram", value: 25, color: "var(--chart-2)" },
  { name: "TikTok", value: 20, color: "var(--chart-3)" },
  { name: "Twitter", value: 15, color: "var(--chart-4)" },
]

const contentPerformanceData = [
  { type: "Videos", views: 45000, engagement: 8.2 },
  { type: "Reels", views: 38000, engagement: 12.1 },
  { type: "Stories", views: 22000, engagement: 6.5 },
  { type: "Posts", views: 18000, engagement: 5.8 },
  { type: "Lives", views: 12000, engagement: 15.3 },
]

const stats = [
  { label: "Total Followers", value: "7.1K", change: "+36.5%", icon: Users },
  { label: "Total Views", value: "135K", change: "+22.1%", icon: Eye },
  { label: "Engagement Rate", value: "8.4%", change: "+1.2%", icon: Heart },
  { label: "Content Shares", value: "3.8K", change: "+18.7%", icon: Share2 },
]

export function AnalyzerDashboard() {
  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your content performance and audience growth across platforms.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-[var(--font-heading)] text-2xl font-bold text-foreground">
                        {stat.value}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Engagement Trends */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[var(--font-heading)] text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Engagement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Area type="monotone" dataKey="likes" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="shares" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="comments" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Audience Growth */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[var(--font-heading)] text-foreground">
                <Users className="h-5 w-5 text-primary" />
                Audience Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={audienceGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="followers"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    dot={{ fill: "var(--chart-1)", r: 5 }}
                    activeDot={{ r: 7, fill: "var(--chart-1)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[var(--font-heading)] text-foreground">
                <Share2 className="h-5 w-5 text-primary" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3">
                  {platformData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="font-[var(--font-heading)] text-sm font-bold text-foreground">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[var(--font-heading)] text-foreground">
                <Eye className="h-5 w-5 text-primary" />
                Content Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={contentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="type" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="views" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder note */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            These are sample analytics. Connect your platforms to see real data and insights powered by MediaMitra.
          </p>
        </div>
      </div>
    </div>
  )
}
