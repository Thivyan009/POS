"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { apiService } from "@/services/api-service"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"

interface BillSummaryProps {
  bill: any
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onApplyDiscount: (amount: number) => void
}

export default function BillSummary({ bill, onRemoveItem, onUpdateQuantity, onApplyDiscount }: BillSummaryProps) {
  const { toast } = useToast()
  const [discountInput, setDiscountInput] = useState("")
  const [discountCodeInput, setDiscountCodeInput] = useState("")
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<any>(null)
  const [isValidatingCode, setIsValidatingCode] = useState(false)

  const handleApplyDiscount = () => {
    const amount = Number.parseFloat(discountInput)
    if (!isNaN(amount) && amount > 0) {
      onApplyDiscount(amount)
      setDiscountInput("")
      setAppliedDiscountCode(null)
      setDiscountCodeInput("")
    }
  }

  const handleApplyDiscountCode = async () => {
    if (!discountCodeInput.trim()) return

    setIsValidatingCode(true)
    try {
      const discountCode = await apiService.validateDiscountCode(discountCodeInput.trim())
      if (discountCode) {
        const discountAmount = (bill.subtotal + bill.tax) * (discountCode.discountPercent / 100)
        onApplyDiscount(discountAmount)
        setAppliedDiscountCode(discountCode)
        setDiscountCodeInput("")
        toast({
          title: "Discount applied!",
          description: `${discountCode.discountPercent}% discount applied`,
        })
      } else {
        toast({
          title: "Invalid code",
          description: "The discount code is invalid or expired",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate discount code",
        variant: "destructive",
      })
    } finally {
      setIsValidatingCode(false)
    }
  }

  const handleRemoveDiscountCode = () => {
    setAppliedDiscountCode(null)
    setDiscountCodeInput("")
    onApplyDiscount(0)
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

      {/* Discount Code Input */}
      {bill.items.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-border flex-shrink-0 space-y-2">
          {appliedDiscountCode ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-100">
                    {appliedDiscountCode.code} - {appliedDiscountCode.discountPercent}% OFF
                  </p>
                  {appliedDiscountCode.description && (
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {appliedDiscountCode.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
                onClick={handleRemoveDiscountCode}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter discount code"
                value={discountCodeInput}
                onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApplyDiscountCode()
                  }
                }}
                className="h-9 sm:h-9 text-sm flex-1 font-mono"
                disabled={isValidatingCode}
              />
              <Button
                onClick={handleApplyDiscountCode}
                size="sm"
                variant="outline"
                className="flex-shrink-0"
                disabled={isValidatingCode || !discountCodeInput.trim()}
              >
                {isValidatingCode ? "..." : "Apply"}
              </Button>
            </div>
          )}

          {/* Manual Discount Input */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Manual discount amount"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="h-9 sm:h-9 text-sm flex-1"
              min="0"
              step="0.01"
              disabled={!!appliedDiscountCode}
            />
            <Button
              onClick={handleApplyDiscount}
              size="sm"
              variant="outline"
              className="flex-shrink-0"
              disabled={!!appliedDiscountCode}
            >
              Apply
            </Button>
          </div>
          {appliedDiscountCode && (
            <p className="text-xs text-muted-foreground">
              Remove discount code to apply manual discount
            </p>
          )}
        </div>
      )}
    </div>
  )
}
