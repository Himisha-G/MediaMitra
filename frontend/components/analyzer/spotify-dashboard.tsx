"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Treemap,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"



/* ---------------- DATA ---------------- */

const artists = [
  { name: "Arijit Singh", popularity: 95 },
  { name: "A.R. Rahman", popularity: 90 },
  { name: "Shreya Ghoshal", popularity: 88 },
  { name: "Anirudh Ravichander", popularity: 85 }
]

const songs = [
  { song: "Kesariya", streams: 620 },
  { song: "Maan Meri Jaan", streams: 580 },
  { song: "Raataan Lambiyan", streams: 540 },
  { song: "Apna Bana Le", streams: 510 },
  { song: "Excuses", streams: 480 }
]

const genres = [
  { name: "Bollywood", size: 40 },
  { name: "Punjabi Pop", size: 25 },
  { name: "Indie", size: 15 },
  { name: "Hip Hop", size: 10 },
  { name: "Classical Fusion", size: 10 }
]

const growth = [
  { month: "Jan", streams: 45 },
  { month: "Feb", streams: 62 },
  { month: "Mar", streams: 80 }
]

const podcasts = [
  { name: "The Ranveer Show", niche: "Interviews / Lifestyle" },
  { name: "Figuring Out with Raj Shamani", niche: "Business / Startups" },
  { name: "Desi Crime Podcast", niche: "True Crime" },
  { name: "The Musafir Stories", niche: "Travel Storytelling" }
]

const distribution = [
  { name: "Songs", value: 70 },
  { name: "Podcasts", value: 20 },
  { name: "Audiobooks", value: 10 }
]

const COLORS = ["#1DB954", "#3b82f6", "#f59e0b"]



/* ---------------- COMPONENT ---------------- */

export function SpotifyDashboard({ onBack }: { onBack: () => void }) {

  return (
    <div className="px-6 py-10 space-y-10 max-w-6xl mx-auto">
      <button
  onClick={onBack}
  className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-white transition"
>
  ← Back to Analyzer
</button>



      {/* SPOTIFY WRAPPED STYLE HERO */}

      <div className="rounded-xl p-8 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-black shadow-lg">

        <h1 className="text-4xl font-bold mb-2">
          Spotify Insights
        </h1>

        <p className="text-lg">
          India's music streaming trends — artists, songs, genres and listener behaviour.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-6">

          <div>
            <p className="text-sm opacity-70">Top Artist</p>
            <p className="text-xl font-semibold">Arijit Singh</p>
          </div>

          <div>
            <p className="text-sm opacity-70">Most Streamed Song</p>
            <p className="text-xl font-semibold">Kesariya</p>
          </div>

          <div>
            <p className="text-sm opacity-70">Dominant Genre</p>
            <p className="text-xl font-semibold">Bollywood</p>
          </div>

        </div>

      </div>



      {/* TOP ARTISTS */}

      <Card>

        <CardHeader>
          <CardTitle>Top Indian Artists</CardTitle>
        </CardHeader>

        <CardContent>

          <p className="text-muted-foreground text-sm mb-4">
            Artist popularity based on Spotify streaming reach.
          </p>

          <ResponsiveContainer width="100%" height={280}>

            <BarChart layout="vertical" data={artists}>

              <XAxis type="number" domain={[0,100]} />
              <YAxis type="category" dataKey="name" />

              <Tooltip />

              <Bar
                dataKey="popularity"
                fill="#6366f1"
                radius={[6,6,6,6]}
              />

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>



      {/* TOP SONGS */}

      <Card>

        <CardHeader>
          <CardTitle>Most Streamed Songs (India)</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart layout="vertical" data={songs}>

              <XAxis type="number"/>
              <YAxis type="category" dataKey="song"/>

              <Tooltip/>

              <Bar
                dataKey="streams"
                fill="#22c55e"
                radius={[6,6,6,6]}
              />

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>



      {/* GENRE DISTRIBUTION */}

      <Card>

        <CardHeader>
          <CardTitle>Genre Distribution</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>

            <Treemap
              data={genres}
              dataKey="size"
              stroke="#111"
              fill="#8b5cf6"
            />

          </ResponsiveContainer>

        </CardContent>

      </Card>



      {/* STREAMING GROWTH */}

      <Card>

        <CardHeader>
          <CardTitle>Streaming Growth (2026)</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={280}>

            <LineChart data={growth}>

              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>

              <Line
                type="monotone"
                dataKey="streams"
                stroke="#3b82f6"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>



      {/* PODCASTS */}

      <Card>

        <CardHeader>
          <CardTitle>Top Indian Podcasts</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">

          {podcasts.map((pod)=>(
            <div
              key={pod.name}
              className="border rounded-lg p-4 hover:border-green-500 transition"
            >
              <p className="font-semibold">{pod.name}</p>
              <p className="text-sm text-muted-foreground">
                Niche: {pod.niche}
              </p>
            </div>
          ))}

        </CardContent>

      </Card>



      {/* CONTENT DISTRIBUTION */}

      <Card>

        <CardHeader>
          <CardTitle>Platform Content Distribution</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >

                {distribution.map((entry,index)=>(
                  <Cell key={index} fill={COLORS[index]}/>
                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>
  )
}