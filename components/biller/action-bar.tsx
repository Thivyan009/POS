"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface ActionBarProps {
  bill: any
  onSubmit: () => void
  onCancel: () => void
  onPreview?: () => void
  isSubmitting?: boolean
}

export default function ActionBar({ bill, onSubmit, onCancel, onPreview, isSubmitting = false }: ActionBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && bill.items.length > 0) {
      onCancel()
    }
  }

  return (
    <div className="border-t border-border bg-card p-2 sm:p-4 md:p-5" onKeyDown={handleKeyDown}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-end">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          {onPreview && (
            <Button
              onClick={onPreview}
              disabled={bill.items.length === 0 || isSubmitting}
              variant="outline"
              className="w-full sm:min-w-[140px] md:min-w-[160px] h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg"
              title="Preview receipt"
            >
              <Eye className="mr-2 h-4 w-4" />
              PREVIEW
            </Button>
          )}
          <Button
            onClick={onSubmit}
            disabled={bill.items.length === 0 || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:min-w-[140px] md:min-w-[160px] h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg"
            title="Enter: Print"
          >
            {isSubmitting ? "Printing..." : "PRINT"}
          </Button>
          <Button
            onClick={onCancel}
            disabled={isSubmitting}
            variant="destructive"
            className="w-full sm:min-w-[120px] md:min-w-[140px] font-bold h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg"
            title="Esc: Cancel"
          >
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  )
}
