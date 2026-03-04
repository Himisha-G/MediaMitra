"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ChatInterface } from "@/components/creator/chat-interface"

export default function CreatorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser()
        setIsLoading(false)
      } catch {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) return null // Prevent layout shift while checking auth

  return (
    <>
      <Navbar />
      <main className="pt-[73px] min-h-screen bg-[#0a0a0a]">
        {/* Ensure your ChatInterface component is set up to accept 
          an 'onAction' or similar prop if you want to trigger 
          niche discovery from a button outside the chat box.
        */}
        <ChatInterface />
      </main>
    </>
  )
}