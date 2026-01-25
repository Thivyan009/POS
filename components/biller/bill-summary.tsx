"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { apiService } from "@/services/api-service"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"

interface BillSummaryProps {
  bill: any
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onApplyDiscount: (amount: number) => void
  onAddCustomer?: () => void
  customerName?: string | null
}

export default function BillSummary({ bill, onRemoveItem, onUpdateQuantity, onApplyDiscount, onAddCustomer, customerName }: BillSummaryProps) {
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
        const discountAmount = bill.subtotal * (discountCode.discountPercent / 100)
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
    <div className="flex w-full flex-col bg-card border-l border-border h-full overflow-hidden">
      <div className="p-3 sm:p-4 md:p-5 border-b border-border flex-shrink-0">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground">Bill Summary</h2>
      </div>

      {/* Customer Info Section */}
      {onAddCustomer && (
        <div className="p-3 sm:p-4 md:p-5 border-b border-border flex-shrink-0">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Customer</Label>
            {customerName ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{customerName}</p>
                  <p className="text-xs text-muted-foreground">Customer added</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddCustomer}
                  className="text-xs"
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={onAddCustomer}
                className="w-full h-9 sm:h-10 text-sm"
              >
                + Add Customer Details
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Items List */}
      <ScrollArea className="flex-1 p-2 sm:p-4 md:p-5 min-h-0">
        {bill.items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 sm:p-8 md:p-10 text-center">
            <p className="text-muted-foreground text-sm md:text-base">No items added</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {bill.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm md:text-base font-medium text-foreground truncate">{item.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    LKR {item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-md bg-background border border-border text-sm sm:text-xs md:text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-8 sm:w-8 md:w-10 text-center text-xs md:text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-md bg-background border border-border text-sm sm:text-xs md:text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors active:scale-95"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-xs md:text-sm text-destructive hover:text-destructive/80 font-semibold whitespace-nowrap ml-1 sm:ml-2 px-2 py-1 rounded hover:bg-destructive/10 transition-colors active:scale-95"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Pricing Breakdown */}
      <div className="p-3 sm:p-4 md:p-5 border-t border-border space-y-2 sm:space-y-3 bg-muted/20 flex-shrink-0">
        <div className="flex justify-between text-xs sm:text-sm md:text-base">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium text-foreground">LKR {bill.subtotal.toFixed(2)}</span>
        </div>
        {bill.discount > 0 && (
          <div className="flex justify-between text-xs sm:text-sm md:text-base">
            <span className="text-muted-foreground">Discount:</span>
            <span className="font-medium text-destructive">−LKR {bill.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base sm:text-lg md:text-xl font-bold pt-2 md:pt-3 border-t border-border">
          <span className="text-foreground">Total:</span>
          <span className="text-primary">LKR {bill.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Discount Code Input - Always show when there are items */}
      {bill.items && bill.items.length > 0 && (
        <div className="p-3 sm:p-4 md:p-5 border-t border-border flex-shrink-0 space-y-2 md:space-y-3 bg-card">
          <div className="text-xs sm:text-sm font-medium text-foreground mb-2">Discount</div>
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
                className="h-9 sm:h-9 md:h-10 text-sm md:text-base flex-1 font-mono"
                disabled={isValidatingCode}
              />
              <Button
                onClick={handleApplyDiscountCode}
                size="sm"
                variant="outline"
                className="flex-shrink-0 text-sm md:text-base"
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
              className="h-9 sm:h-9 md:h-10 text-sm md:text-base flex-1"
              min="0"
              step="0.01"
              disabled={!!appliedDiscountCode}
            />
            <Button
              onClick={handleApplyDiscount}
              size="sm"
              variant="outline"
              className="flex-shrink-0 text-sm md:text-base"
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
