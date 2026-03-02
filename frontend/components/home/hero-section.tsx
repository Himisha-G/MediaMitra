import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
        
        {/* Left Side: Content */}
        <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            Your Content Creator Companion
          </div>

          <h1 className="font-[var(--font-heading)] text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            <span className="text-balance">Media</span>
            <span className="text-primary">Mitra</span>
          </h1>
        
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Discover your niche, create smarter content, analyze your growth, and
            manage events — all powered by AI in one place.
          </p>

          <div className="flex items-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/creator">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/analyzer">View Analytics</Link>
            </Button>
          </div>
        </div>

        {/* Right Side: Image Placeholder */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-full max-w-[500px] rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10">
            { 
               <img src="/MakeContent.jpeg" alt="Dashboard" className="object-contain" />
            }
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
             
            </div>
          </div>
        </div>

      </div>

      <a
        href="#features"
        className="absolute bottom-10 flex flex-col items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll down to features"
      >
        Explore
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  )
}