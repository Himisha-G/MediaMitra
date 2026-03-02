import { Navbar } from "@/components/navbar"
import { ChatInterface } from "@/components/creator/chat-interface"

export const metadata = {
  title: "Creator - MediaMitra",
  description: "AI-powered chatbot to help you find your niche, brainstorm ideas, and grow as a content creator.",
}

export default function CreatorPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[73px]">
        <ChatInterface />
      </main>
    </>
  )
}
