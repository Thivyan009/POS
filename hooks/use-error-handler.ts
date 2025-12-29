"use client"

import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

type ErrorType = "network" | "printer" | "whatsapp" | "validation" | "unknown"

interface ErrorConfig {
  title: string
  description: string
  variant: "default" | "destructive"
  duration?: number
}

export function useErrorHandler() {
  const { toast } = useToast()

  const handleError = useCallback(
    (error: any, type: ErrorType = "unknown") => {
      let config: ErrorConfig

      switch (type) {
        case "network":
          config = {
            title: "Network Error",
            description: "Failed to connect. Check your internet connection.",
            variant: "destructive",
            duration: 5000,
          }
          break

        case "printer":
          config = {
            title: "Printer Error",
            description: "Failed to print. Check printer connection.",
            variant: "destructive",
            duration: 5000,
          }
          break

        case "whatsapp":
          config = {
            title: "WhatsApp Error",
            description: "Failed to send message, but bill was saved.",
            variant: "destructive",
            duration: 4000,
          }
          break

        case "validation":
          config = {
            title: "Validation Error",
            description: error?.message || "Please check your input.",
            variant: "destructive",
            duration: 3000,
          }
          break

        default:
          config = {
            title: "Error",
            description: error?.message || "Something went wrong. Please try again.",
            variant: "destructive",
            duration: 4000,
          }
      }

      toast(config)
    },
    [toast],
  )

  return { handleError }
}
