"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchAuthSession } from "aws-amplify/auth"

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession()
        if (!session.tokens) {
          router.replace("/login")
        }
      } catch {
        router.replace("/login")
      }
    }

    checkAuth()
  }, [])
}