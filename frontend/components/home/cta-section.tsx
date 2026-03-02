import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center">
        <h2 className="font-[var(--font-heading)] text-3xl font-bold text-foreground sm:text-4xl">
          <span className="text-balance">Ready to Transform Your Content Game?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Join thousands of creators using MediaMitra to discover niches,
          analyze performance, and manage their creator journey with AI.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/creator">Start Creating</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/events">Manage Events</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
