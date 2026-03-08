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
  onClick={() => {
    window.location.href =
      "https://YOUR_DOMAIN.auth.ap-southeast-2.amazoncognito.com/login?client_id=YOUR_CLIENT_ID&response_type=code&scope=email+openid+profile&redirect_uri=https://main.d3qsdg65dn72cr.amplifyapp.com/login";
  }}
  className="bg-green-500 px-6 py-3 rounded text-black"
>
  Login / Signup
</button>
    </div>
  )
}