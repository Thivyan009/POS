"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

interface User {
  username: string
  role: "admin" | "biller"
  token: string
}

export function useAuth() {
  const router = useRouter()

  const getUser = useCallback((): User | null => {
    if (typeof window === "undefined") return null

    const token = localStorage.getItem("pos-token")
    const role = localStorage.getItem("pos-role") as "admin" | "biller" | null
    const username = localStorage.getItem("pos-username")

    if (token && role && username) {
      return { token, role, username }
    }
    return null
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("pos-token")
    localStorage.removeItem("pos-role")
    localStorage.removeItem("pos-username")
    router.push("/login")
  }, [router])

  return { getUser, logout }
}
