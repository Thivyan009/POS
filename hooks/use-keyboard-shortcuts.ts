"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Enter key
      if (e.key === "Enter" && shortcuts["Enter"]) {
        e.preventDefault()
        shortcuts["Enter"]()
      }

      // Check for Escape key
      if (e.key === "Escape" && shortcuts["Escape"]) {
        e.preventDefault()
        shortcuts["Escape"]()
      }

      // Check for other shortcuts
      for (const [key, handler] of Object.entries(shortcuts)) {
        if (key !== "Enter" && key !== "Escape" && e.key === key) {
          e.preventDefault()
          handler()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}
