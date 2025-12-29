"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("pos-token")
    const role = localStorage.getItem("pos-role")

    if (token && role) {
      // Redirect based on role
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else if (role === "biller") {
        router.push("/biller")
      }
    } else {
      // Redirect to login
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin">⚙️</div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
