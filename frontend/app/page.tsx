import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[73px]">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <footer className="border-t border-border px-6 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              MediaMitra. Built for creators, by creators.
            </p>
            <p className="text-sm text-muted-foreground">
              All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
