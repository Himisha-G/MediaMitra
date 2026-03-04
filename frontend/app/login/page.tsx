"use client"

import { signInWithRedirect } from "aws-amplify/auth"

export default function LoginPage() {

  const handleLogin = async () => {
    await signInWithRedirect()
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-xl">Login to MediaMitra</h1>

      <button
        onClick={handleLogin}
        className="bg-green-500 px-6 py-3 rounded text-black"
      >
        Login / Signup
      </button>
    </div>
  )
}