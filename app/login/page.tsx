"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const usernameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameInputRef.current?.focus()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call - In production, call your backend
      // For now, mock authentication based on username
      const role = username === "admin" ? "admin" : "biller"

      // In production, validate with backend first
      localStorage.setItem("pos-token", `token-${Date.now()}`)
      localStorage.setItem("pos-role", role)
      localStorage.setItem("pos-username", username)

      toast({
        title: "Success",
        description: `Welcome, ${username}!`,
      })

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/biller")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (role: "admin" | "biller") => {
    setIsLoading(true)

    try {
      const username = role === "admin" ? "admin" : "biller"
      
      localStorage.setItem("pos-token", `token-${Date.now()}`)
      localStorage.setItem("pos-role", role)
      localStorage.setItem("pos-username", username)

      toast({
        title: "Success",
        description: `Logged in as ${role}`,
      })

      if (role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/biller")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("pos-token")
    localStorage.removeItem("pos-role")
    localStorage.removeItem("pos-username")
    router.push("/login")
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-3 sm:p-4">
      <Card className="w-full max-w-md">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <Image
              src="/restaurant-logo.png"
              alt="Restaurant Logo"
              width={120}
              height={120}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">Restaurant POS</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 text-center">Sign in to your account</p>

          {/* Quick Login Buttons for Testing */}
          <div className="mb-4 sm:mb-6 space-y-2">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Login (Testing Only):</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                disabled={isLoading}
                variant="outline"
                className="w-full text-xs sm:text-sm"
              >
                Login as Admin
              </Button>
              <Button
                type="button"
                onClick={() => handleQuickLogin("biller")}
                disabled={isLoading}
                variant="outline"
                className="w-full text-xs sm:text-sm"
              >
                Login as Biller
              </Button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Username
              </label>
              <Input
                ref={usernameInputRef}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={isLoading}
                className="text-sm sm:text-base h-10 sm:h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">Try 'admin' for admin access</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLoading}
                className="text-sm sm:text-base h-10 sm:h-11"
              />
            </div>

            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading || !username || !password}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: username (any), password (any)
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
