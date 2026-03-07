"use client"

import { Mic } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { fetchAuthSession } from "aws-amplify/auth"

export function VoiceChat(){

const [recording,setRecording] = useState(false)

const mediaRecorder = useRef<MediaRecorder | null>(null)
const chunks = useRef<Blob[]>([])

const startRecording = async()=>{

console.log("Mic clicked")

const stream = await navigator.mediaDevices.getUserMedia({audio:true})

const recorder = new MediaRecorder(stream)

mediaRecorder.current = recorder

recorder.ondataavailable = e=>{
chunks.current.push(e.data)
}

recorder.onstop = async()=>{

const blob = new Blob(chunks.current,{type:"audio/webm"})
chunks.current=[]

const base64 = await blobToBase64(blob)

sendVoice(base64)

}

recorder.start()

setRecording(true)

/* stop recording after 6 seconds automatically */
setTimeout(()=>{
stopRecording()
},6000)

}

const stopRecording = ()=>{
console.log("Stopping recording")
mediaRecorder.current?.stop()
setRecording(false)
}

const blobToBase64=(blob:Blob)=>{

return new Promise<string>((resolve)=>{

const reader = new FileReader()

reader.onloadend=()=>{
resolve((reader.result as string).split(",")[1])
}

reader.readAsDataURL(blob)

})

}

const sendVoice = async(audio:string)=>{

try{

console.log("Sending audio to API")

/* GET COGNITO TOKEN */
const session = await fetchAuthSession()
const token = session.tokens?.idToken?.toString()

const res = await fetch(process.env.NEXT_PUBLIC_VOICE_API!,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
audio
})

})

const data = await res.json()

console.log("Voice API response:",data)

/* PLAY AI VOICE */
if(data.audio){

const audioPlayer = new Audio(`data:audio/mp3;base64,${data.audio}`)
audioPlayer.play()

}

}catch(err){

console.error("Voice error:",err)

}

}

return(

<Button
variant="ghost"
size="icon"
onClick={recording ? stopRecording : startRecording}
className={`border ${recording ? "text-red-500 border-red-500":"text-[#00C9A7]"}`}
>

<Mic/>

</Button>

)

}