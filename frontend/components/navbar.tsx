"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, MessageSquare, BarChart3, CalendarDays, Menu, X } from "lucide-react"
import { signInWithRedirect, signOut, getCurrentUser } from "aws-amplify/auth"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Creator", href: "/creator", icon: MessageSquare },
  { label: "Analyzer", href: "/analyzer", icon: BarChart3 },
  { label: "Event Manager", href: "/events", icon: CalendarDays },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      await getCurrentUser()
      setLoggedIn(true)
    } catch {
      setLoggedIn(false)
    }
  }

  async function handleLogout() {
    await signOut()
    setLoggedIn(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            MediaMitra
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signInWithRedirect()}
              className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}

            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signInWithRedirect()}
                className="mt-2 rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground"
              >
                Login
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  )
}