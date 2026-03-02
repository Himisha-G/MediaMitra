import { Navbar } from "@/components/navbar"
import { AnalyzerDashboard } from "@/components/analyzer/analyzer-dashboard"

export const metadata = {
  title: "Analyzer - MediaMitra",
  description: "Analyze your content performance with charts, metrics, and AI-powered insights.",
}

export default function AnalyzerPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[73px]">
        <AnalyzerDashboard />
      </main>
    </>
  )
}
