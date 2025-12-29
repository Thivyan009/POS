"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface ActionBarProps {
  bill: any
  onSubmit: (whatsappNumber: string, sendViaWhatsapp: boolean) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export default function ActionBar({ bill, onSubmit, onCancel, isSubmitting = false }: ActionBarProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [sendViaWhatsapp, setSendViaWhatsapp] = useState(false)

  const handleSubmit = async () => {
    await onSubmit(whatsappNumber, sendViaWhatsapp)
    setWhatsappNumber("")
    setSendViaWhatsapp(false)
  }

  const handleCancel = () => {
    setWhatsappNumber("")
    setSendViaWhatsapp(false)
    onCancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && bill.items.length > 0) {
      handleCancel()
    }
  }

  return (
    <div className="border-t border-border bg-card p-2 sm:p-4 lg:pb-4" onKeyDown={handleKeyDown}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* WhatsApp Input */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">WhatsApp:</label>
            <Input
              type="tel"
              placeholder="+1234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              disabled={isSubmitting || bill.items.length === 0}
              className="h-9 sm:h-10 flex-1 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="send-whatsapp"
              checked={sendViaWhatsapp}
              onCheckedChange={(checked) => setSendViaWhatsapp(!!checked)}
              disabled={isSubmitting || bill.items.length === 0}
            />
            <label htmlFor="send-whatsapp" className="text-xs sm:text-sm cursor-pointer">
              Send
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSubmit}
            disabled={bill.items.length === 0 || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:min-w-[140px] h-10 sm:h-auto text-sm sm:text-base"
            title="Enter: Print & Send"
          >
            {isSubmitting ? "Printing..." : "PRINT & SEND"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={bill.items.length === 0 || isSubmitting}
            variant="outline"
            className="w-full sm:min-w-[120px] font-bold bg-transparent h-10 text-sm sm:text-base"
          >
            PRINT ONLY
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isSubmitting}
            variant="destructive"
            className="w-full sm:min-w-[120px] font-bold h-10 text-sm sm:text-base"
            title="Esc: Cancel"
          >
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  )
}
