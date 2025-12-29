"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface BillSummaryProps {
  bill: any
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onApplyDiscount: (amount: number) => void
}

export default function BillSummary({ bill, onRemoveItem, onUpdateQuantity, onApplyDiscount }: BillSummaryProps) {
  const [discountInput, setDiscountInput] = useState("")

  const handleApplyDiscount = () => {
    const amount = Number.parseFloat(discountInput)
    if (!isNaN(amount) && amount > 0) {
      onApplyDiscount(amount)
      setDiscountInput("")
    }
  }

  return (
    <div className="flex w-full lg:w-[30%] flex-col bg-card border-l border-border h-full">
      <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
        <h2 className="text-base sm:text-lg font-bold text-foreground">Bill Summary</h2>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1 p-2 sm:p-4">
        {bill.items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 sm:p-8 text-center">
            <p className="text-muted-foreground text-sm">No items added</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bill.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 sm:h-7 sm:w-7 rounded-md bg-background border border-border text-sm sm:text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-8 sm:w-8 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 sm:h-7 sm:w-7 rounded-md bg-background border border-border text-sm sm:text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors active:scale-95"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-xs text-destructive hover:text-destructive/80 font-semibold whitespace-nowrap ml-1 sm:ml-2 px-2 py-1 rounded hover:bg-destructive/10 transition-colors active:scale-95"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Pricing Breakdown */}
      <div className="p-3 sm:p-4 border-t border-border space-y-2 sm:space-y-3 bg-muted/20 flex-shrink-0">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium text-foreground">${bill.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Tax:</span>
          <span className="font-medium text-foreground">${bill.tax.toFixed(2)}</span>
        </div>
        {bill.discount > 0 && (
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Discount:</span>
            <span className="font-medium text-destructive">−${bill.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-border">
          <span className="text-foreground">Total:</span>
          <span className="text-primary">${bill.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Discount Input */}
      {bill.items.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-border flex-shrink-0">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Discount"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="h-9 sm:h-9 text-sm flex-1"
              min="0"
              step="0.01"
            />
            <Button onClick={handleApplyDiscount} size="sm" variant="outline" className="flex-shrink-0">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
