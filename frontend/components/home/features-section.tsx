import Image from "next/image"
import { MessageSquare, BarChart3, CalendarDays } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Creator Assistant",
    description:
      "Chat with your personal AI to discover trending niches, brainstorm content ideas, and get tailored strategies for growth. Upload files, use voice, and explore with the Niche Finder tool.",
    image: "/images/feature-creator.jpg",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Visualize your content performance with powerful charts and data-driven insights. Track engagement, audience growth, and content reach — all in real-time dashboards.",
    image: "/images/feature-analytics.jpg",
  },
  {
    icon: CalendarDays,
    title: "Event Manager",
    description:
      "Plan, schedule, and manage your content events and collaborations. Keep your calendar organized with a dedicated event management system and login access.",
    image: "/images/feature-events.jpg",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold text-foreground sm:text-4xl">
            <span className="text-balance">Everything You Need to</span>{" "}
            <span className="text-primary">Create & Grow</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            MediaMitra bundles creator tools, AI insights, and event management
            into one unified platform built for your workflow.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isReversed = index % 2 !== 0
            return (
              <div
                key={feature.title}
                className={`flex flex-col items-center gap-10 lg:flex-row ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
