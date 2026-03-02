"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Paperclip, Compass, Bot, User, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileData {
  name: string
  type: string
  data: string // base64 string
}

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  files?: string[]
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Welcome to MediaMitra Creator! I've been keeping track of our journey. I can help you find your niche, brainstorm content ideas, and more. How can I help you today?",
    },
  ])

  const [input, setInput] = useState("")
  const [userId, setUserId] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<FileData[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 1. Initialize or Retrieve User Identity on Load
  useEffect(() => {
    let id = localStorage.getItem("mediaMitra_creator_id")
    if (!id) {
      id = "creator_" + Math.random().toString(36).substring(2, 9)
      localStorage.setItem("mediaMitra_creator_id", id)
    }
    setUserId(id)
  }, [])

  // 2. NEW: Fetch History from Backend when tab is opened
  // This prevents the chat from disappearing when you switch tabs
  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return
      
      setIsLoading(true)
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, action: "get_history" }),
        })
        
        const data = await res.json()
        if (data.history && data.history.length > 0) {
          // Format raw DynamoDB items into the UI message format
          const historyMessages = data.history.flatMap((item: any) => [
            { 
                id: `u-${item.timestamp}`, 
                role: "user", 
                content: item.userMessage 
            },
            { 
                id: `b-${item.timestamp}`, 
                role: "bot", 
                content: item.aiMessage 
            }
          ])
          
          setMessages([
            {
              id: "welcome",
              role: "bot",
              content: "Welcome back! Restoring our conversation history...",
            },
            ...historyMessages
          ])
        }
      } catch (error) {
        console.error("Failed to load history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [userId])

  // 3. Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleAction = async (actionType: "chat" | "get_niche", textOverride?: string) => {
    const messageText = textOverride || input.trim()
    
    if (actionType === "chat" && !messageText && attachedFiles.length === 0) return

    const filesForUI = attachedFiles.map(f => f.name)

    if (actionType === "chat") {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageText,
        files: filesForUI.length > 0 ? filesForUI : undefined,
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
    }

    setIsLoading(true)

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: userId,
          message: actionType === "chat" ? messageText : "Find my niche based on our history",
          action: actionType,
          files: actionType === "chat" ? attachedFiles : []
        }),
      })

      const data = await res.json()
      setAttachedFiles([]) 

      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content: data.response || "I'm having a bit of trouble connecting. Could you try that again?",
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("API error:", error)
      setMessages((prev) => [...prev, {
        id: "error",
        role: "bot",
        content: "Connection failed. Please check your AWS API Gateway/CORS settings.",
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const resetSession = () => {
    if (confirm("Clear local chat history?")) {
        setMessages([
            {
              id: "welcome",
              role: "bot",
              content: "Session reset! What should we work on next?",
            },
        ]);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: FileData[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const base64 = await fileToBase64(file)
        newFiles.push({ name: file.name, type: file.type, data: base64 })
      }
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setInput("How can I grow my audience on TikTok?")
      }, 1500)
    }
  }

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col bg-[#0B0E11] text-white font-sans">
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col bg-[#0B0E11] overflow-hidden">
        
        {/* Header - Original Dark Look */}
        <header className="p-5 border-b border-gray-800 bg-[#0B0E11] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#1E1E1E] p-1.5 rounded-lg border border-gray-800 shadow-lg shadow-black/20">
              <Bot className="h-5 w-5 text-[#00C9A7]" />
            </div>
            <div>
              <h1 className="font-bold text-gray-200 text-lg tracking-tight">MediaMitra AI</h1>
              <p className="text-[10px] text-green-500 font-medium uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Systems Active
                <span className="ml-2 text-gray-500 font-mono lowercase tracking-normal">({userId})</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction("get_niche")}
                disabled={isLoading}
                className="gap-2 border-[#00C9A7]/30 bg-transparent text-[#00C9A7] hover:bg-[#00C9A7]/10 font-bold shadow-sm"
              >
                <Compass className="h-4 w-4" />
                Find My Niche
            </Button>
            <Button variant="ghost" size="icon" onClick={resetSession} className="text-gray-600 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Chat Area - Original Look */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0B0E11]">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-1",
                msg.role === "user" ? "bg-[#00C9A7]/20 border border-[#00C9A7]/30" : "bg-[#1E1E1E] border border-gray-800"
              )}>
                {msg.role === "user" ? <User className="h-4 w-4 text-[#00C9A7]" /> : <Bot className="h-4 w-4 text-gray-400" />}
              </div>
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl shadow-sm leading-relaxed text-sm",
                msg.role === "user" 
                  ? "bg-[#00C9A7] text-black font-medium" 
                  : "bg-[#1E1E1E] border border-gray-800 text-gray-200"
              )}>
                <div className="whitespace-pre-line">
                    {msg.content}
                </div>
                {msg.files && (
                  <div className="mt-2 pt-2 border-t border-gray-700 flex flex-wrap gap-2">
                    {msg.files.map(f => (
                       <span key={f} className="text-[10px] text-gray-500 italic flex items-center gap-1">
                         <Paperclip className="h-3 w-3" /> {f}
                       </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-[#1E1E1E] animate-pulse" />
                <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-gray-800 text-gray-500 italic text-xs animate-pulse">
                Thinking...
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Footer Area */}
        <footer className="p-5 border-t border-gray-800 bg-[#0B0E11]">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 px-1">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-[#1E1E1E] px-2.5 py-1 rounded-full text-[10px] text-gray-400 border border-gray-800">
                  <Paperclip className="h-3 w-3" />
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button onClick={() => setAttachedFiles(f => f.filter((_, i) => i !== idx))} className="ml-1 hover:text-red-500"><X size={12}/></button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-center">
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-[#00C9A7] transition-colors">
              <Paperclip size={20} />
            </button>
            <button type="button" onClick={toggleRecording} className={cn("text-gray-500 transition-colors", isRecording && "text-red-500 animate-pulse")}>
              <Mic size={20} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAction("chat")}
              placeholder="Ask MediaMitra anything..."
              className="flex-grow p-3 bg-transparent border border-gray-800 rounded-2xl focus:outline-none focus:border-[#00C9A7] transition-all text-sm placeholder:text-gray-600"
              disabled={isLoading}
              autoComplete="off"
            />

            <button 
              onClick={() => handleAction("chat")}
              disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
              className="bg-[#00C9A7] text-black p-3 rounded-xl hover:bg-[#00B294] transition-all shadow-md disabled:opacity-50 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-3 text-center uppercase tracking-widest font-medium">
            Powered by Bedrock Claude 3 Haiku
          </p>
        </footer>
      </div>
    </div>
  )
}