"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/auth-service"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      const msg = "Please enter both email and password."
      setErrorMessage(msg)
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
      return
    }

    setErrorMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if migration is needed
        if (data.migrationNeeded) {
          toast({
            title: "Database Migration Required",
            description: data.details || "Please run the migration SQL in Supabase SQL Editor.",
            variant: "destructive",
            duration: 15000,
          })
          // Show migration instructions
          setTimeout(() => {
            if (confirm("Database migration is required. Would you like to open the setup page for instructions?")) {
              window.open("/admin/setup", "_blank")
            }
          }, 500)
          setIsLoading(false)
          return
        }

        // Display error message
        const errorMsg = data.error || "Invalid email or password. Please try again."
        setErrorMessage(errorMsg)
        toast({
          title: "Login Failed",
          description: errorMsg,
          variant: "destructive",
          duration: 5000,
        })
        
        // Clear password field on error for security
        setPassword("")
        setIsLoading(false)
        return
      }

      const user = data as { id: string; email: string; role: "admin" | "biller"; enabled: boolean }

      // Set user session
      authService.setSession(user)

      toast({
        title: "Success",
        description: `Welcome, ${user.email}!`,
      })

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/biller")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMsg = error?.message || "An error occurred. Please check your credentials and try again."
      setErrorMessage(errorMsg)
      toast({
        title: "Login Failed",
        description: errorMsg,
        variant: "destructive",
        duration: 5000,
      })
      // Clear password field on error
      setPassword("")
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">Paruthimunai Restaurant</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 text-center">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                className="text-sm sm:text-base h-10 sm:h-11"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  // Clear error when user starts typing
                  if (errorMessage) setErrorMessage("")
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                className={`text-sm sm:text-base h-10 sm:h-11 ${errorMessage ? "border-destructive" : ""}`}
                autoComplete="current-password"
              />
              {errorMessage && (
                <p className="mt-1.5 text-xs text-destructive font-medium">
                  {errorMessage}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading || !email || !password}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <Button
              type="button"
              onClick={() => router.push("/customer")}
              variant="outline"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
            >
              🍽️ View Menu (No Login Required)
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Default admin: paruthimunaitech@gmail.com
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
