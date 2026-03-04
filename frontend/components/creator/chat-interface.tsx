"use client"

import { useState, useRef } from "react"
import { Send, Paperclip, Bot, User, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchAuthSession } from "aws-amplify/auth"

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

export function ChatInterface() {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Welcome to MediaMitra Creator! I'm ready to help you brainstorm your next big project."
    }
  ])

  const [input,setInput] = useState("")
  const [files,setFiles] = useState<FileData[]>([])
  const [loading,setLoading] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  // ---------- FILE UPLOAD ----------

  const handleFileUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {

    const selected = e.target.files
    if(!selected) return

    const newFiles:FileData[] = []

    for(const file of Array.from(selected)){

      const reader = new FileReader()

      const base64 = await new Promise<string>((resolve)=>{
        reader.onload = ()=>{
          resolve((reader.result as string).split(",")[1])
        }
        reader.readAsDataURL(file)
      })

      newFiles.push({
        name:file.name,
        type:file.type,
        data:base64
      })
    }

    setFiles(prev=>[...prev,...newFiles])
  }

  // ---------- CHAT SEND ----------

  const sendMessage = async ()=>{

    if(!input && files.length===0) return

    const userMsg:Message = {
      id:crypto.randomUUID(),
      role:"user",
      content:input,
      files:files.map(f=>f.name)
    }

    setMessages(prev=>[...prev,userMsg])
    setInput("")
    setLoading(true)

    try{

      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!,{

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body:JSON.stringify({
          action:"chat",
          message:userMsg.content,
          files:files
        })

      })

      const data = await res.json()

      setMessages(prev=>[
        ...prev,
        {
          id:crypto.randomUUID(),
          role:"bot",
          content:data.response || "Something went wrong."
        }
      ])

      setFiles([])

    }catch(err){

      console.error(err)

      setMessages(prev=>[
        ...prev,
        {
          id:"error",
          role:"bot",
          content:"Connection failed."
        }
      ])
    }

    setLoading(false)
  }

  // ---------- NICHE BUTTON ----------

  const handleNiche = async ()=>{

    setLoading(true)

    try{

      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!,{

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body:JSON.stringify({
          action:"get_niche"
        })

      })

      const data = await res.json()

      setMessages(prev=>[
        ...prev,
        {
          id:crypto.randomUUID(),
          role:"bot",
          content:data.response
        }
      ])

    }catch(err){

      console.error(err)

    }

    setLoading(false)
  }

  // ---------- UI ----------

  return(

    <div className="flex h-[calc(100vh-73px)] flex-col bg-[#0B0E11] text-white">

      <div className="mx-auto w-full max-w-3xl h-full flex flex-col">

        {/* HEADER */}

        <header className="p-5 border-b border-gray-800 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Bot className="text-[#00C9A7]" />
            <h1 className="font-bold text-lg">MediaMitra AI</h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-[#00C9A7] text-[#00C9A7]"
            onClick={handleNiche}
          >
            <Compass className="h-4 w-4 mr-2"/>
            Find My Niche
          </Button>

        </header>


        {/* CHAT AREA */}

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.map(msg=>(
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role==="user"?"flex-row-reverse":""}`}
            >

              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#1E1E1E]">

                {msg.role==="user"
                  ? <User/>
                  : <Bot className="text-[#00C9A7]"/>}

              </div>

              <div className="max-w-[80%] p-4 rounded-2xl bg-[#1E1E1E] text-sm">

                {msg.content}

                {msg.files && (
                  <div className="text-xs mt-2 opacity-60">
                    {msg.files.join(", ")}
                  </div>
                )}

              </div>

            </div>
          ))}

          {loading && (
            <p className="text-xs text-[#00C9A7]">
              MediaMitra thinking...
            </p>
          )}

        </main>


        {/* INPUT */}

        <footer className="p-5 flex gap-2">

          <Button
            variant="ghost"
            size="icon"
            onClick={()=>fileRef.current?.click()}
          >
            <Paperclip/>
          </Button>

          <input
            type="file"
            ref={fileRef}
            hidden
            multiple
            accept="image/*"
            onChange={handleFileUpload}
          />

          <input
            className="flex-1 bg-[#1E1E1E] rounded-xl p-3"
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && sendMessage()}
            placeholder="Ask MediaMitra anything..."
          />

          <button
            onClick={sendMessage}
            className="bg-[#00C9A7] p-3 rounded-xl"
          >
            <Send/>
          </button>

        </footer>

      </div>

    </div>
  )
}