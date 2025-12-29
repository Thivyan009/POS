"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card p-3 sm:p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Image
          src="/restaurant-logo.png"
          alt="Restaurant Logo"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Restaurant Admin</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Dashboard & Management</p>
        </div>
      </div>
      <Button onClick={onLogout} variant="outline" size="sm" className="ml-2 text-xs sm:text-sm">
        Logout
      </Button>
    </div>
  )
}
