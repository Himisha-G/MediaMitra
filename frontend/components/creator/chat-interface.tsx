"use client"

import { useState, useRef } from "react"
import { Send, Paperclip, Bot, User, Compass, Mic, Loader2, Square, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchAuthSession } from "aws-amplify/auth"
import ReactMarkdown from "react-markdown"

// ---------- TYPES ----------

interface FileData {
  name: string
  type: string
  data: string
}

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  files?: string[]
}

// ---------- VOICE CHAT COMPONENT ----------

interface VoiceChatProps {
  onVoiceResponse: (user: string, bot: string) => void
}

function VoiceChat({ onVoiceResponse }: VoiceChatProps) {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg"
      const recorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.current = recorder
      chunks.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: mimeType })
        const base64 = await blobToBase64(blob)
        stream.getTracks().forEach((t) => t.stop())
        await sendVoice(base64)
      }

      recorder.start()
      setRecording(true)

      setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") stopRecording()
      }, 10000)

    } catch (err) {
      setError("Microphone permission denied.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop()
    }
    setRecording(false)
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => resolve(reader.result as string)
    })
  }

  const sendVoice = async (base64: string) => {
    setLoading(true)
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()
      const apiUrl = process.env.NEXT_PUBLIC_VOICE_API || process.env.NEXT_PUBLIC_API_URL;
      
      const res = await fetch(apiUrl!, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ audio_bytes: base64 }),
      })

      const data = await res.json()
      onVoiceResponse(data.text || "", data.reply || "")

    } catch (e: any) {
      setError("Failed to process voice.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={recording ? stopRecording : startRecording}
        disabled={loading}
        className={`w-10 h-10 rounded-full border-2 transition-all ${
          recording ? "border-red-500 text-red-500 animate-pulse" : "border-[#00C9A7] text-[#00C9A7]"
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : recording ? <Square /> : <Mic />}
      </Button>
      {error && <span className="absolute -top-6 text-[10px] text-red-400 whitespace-nowrap">{error}</span>}
    </div>
  )
}

// ---------- MAIN CHAT INTERFACE ----------

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Welcome to MediaMitra Creator! I'm ready to help you brainstorm your next big project."
    }
  ])

  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return

    const newFiles: FileData[] = []
    for (const file of Array.from(selected)) {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve((reader.result as string).split(",")[1])
        }
        reader.readAsDataURL(file)
      })

      newFiles.push({
        name: file.name,
        type: file.type,
        data: base64
      })
    }
    setFiles(prev => [...prev, ...newFiles])
  }

  const sendMessage = async () => {
    if (!input && files.length === 0) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      files: files.map(f => f.name)
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "chat",
          message: userMsg.content,
          files: files
        })
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          content: data.response || "Something went wrong."
        }
      ])
      setFiles([])
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        {
          id: "error",
          role: "bot",
          content: "Connection failed."
        }
      ])
    }
    setLoading(false)
  }

  const handleNiche = async () => {
    setLoading(true)
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: "get_niche" })
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          content: data.response
        }
      ])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleVoiceResponse = (text: string, reply: string) => {
    if (!text && !reply) return

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: text || "Voice message",
      },
      {
        id: crypto.randomUUID(),
        role: "bot",
        content: reply || "I processed your request but had no reply.",
      },
    ])
  }

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col bg-[#0B0E11] text-white">
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col">
        {/* HEADER */}
        <header className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="text-[#00C9A7]" />
            <h1 className="font-bold text-lg">MediaMitra AI</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#00C9A7] text-[#00C9A7]"
              onClick={() => setShowFeatures(true)}
            >
              Features
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#00C9A7] text-[#00C9A7]"
              onClick={handleNiche}
            >
              <Compass className="h-4 w-4 mr-2" />
              Find My Niche
            </Button>
          </div>
        </header>

        {/* CHAT AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-[#1E1E1E]">
                {msg.role === "user" ? <User /> : <Bot className="text-[#00C9A7]" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl bg-[#1E1E1E] text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'border-r-4 border-[#00C9A7]' : 'border-l-4 border-gray-600'}`}>
                {msg.role === "bot" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3">{children}</p>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-3">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-md font-semibold mb-2">{children}</h2>,
                      ul: ({ children }) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="text-[#00C9A7]">{children}</strong>
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
                {msg.files && msg.files.length > 0 && (
                  <div className="text-xs mt-2 opacity-60">
                    📎 {msg.files.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <p className="text-xs text-[#00C9A7] animate-pulse">MediaMitra thinking...</p>}
        </main>

        {/* FEATURES PANEL (REDACTED FOR BREVITY - SAME AS ORIGINAL) */}
        <div className={`fixed top-0 right-0 h-full w-[320px] bg-[#0B0E11] border-l border-gray-800 shadow-xl transform transition-transform duration-300 z-50 ${showFeatures ? "translate-x-0" : "translate-x-full"}`}>
           <div className="p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#00C9A7]">MediaMitra Features</h2>
                <button onClick={() => setShowFeatures(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <ul className="space-y-4 text-sm">
                <li className="bg-[#1E1E1E] p-3 rounded-xl">🌍 <b>Multilingual</b></li>
                <li className="bg-[#1E1E1E] p-3 rounded-xl">✍️ <b>Platform-Specific Scripts</b></li>
                <li className="bg-[#1E1E1E] p-3 rounded-xl">🧠 <b>Persona Generation</b></li>
                <li className="bg-[#1E1E1E] p-3 rounded-xl">🔎 <b>Niche Discovery</b></li>
              </ul>
           </div>
        </div>

        {/* FOOTER / INPUT AREA */}
        {files.length > 0 && (
          <div className="px-5 pb-2 flex flex-col gap-2 items-start">
            {files.map((file, index) => (
              <div key={index} className="bg-[#1E1E1E] text-xs px-3 py-2 rounded-xl flex items-center gap-2 max-w-fit">
                📎 {file.name}
                <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300 ml-2">✕</button>
              </div>
            ))}
          </div>
        )}
        
        <footer className="p-5 flex gap-2 items-center relative">
          <Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()} className="text-gray-400 hover:text-white">
            <Paperclip />
          </Button>

          <VoiceChat onVoiceResponse={handleVoiceResponse} />

          <input type="file" ref={fileRef} hidden multiple accept="image/*" onChange={handleFileUpload} />

          <input
            className="flex-1 bg-[#1E1E1E] rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#00C9A7] text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask MediaMitra anything..."
          />

          <button onClick={sendMessage} className="bg-[#00C9A7] p-3 rounded-xl hover:bg-[#00B896] transition-colors">
            <Send />
          </button>
        </footer>
      </div>
    </div>
  )
}