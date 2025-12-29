"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { authService, type AuthUser } from "@/services/auth-service"

export function useAuth() {
  const router = useRouter()

  const getUser = useCallback((): AuthUser | null => {
    return authService.getCurrentUser()
  }, [])

  const logout = useCallback(() => {
    authService.clearSession()
    router.push("/login")
  }, [router])

  const isAuthenticated = useCallback((): boolean => {
    return authService.isAuthenticated()
  }, [])

  return { getUser, logout, isAuthenticated }
}
