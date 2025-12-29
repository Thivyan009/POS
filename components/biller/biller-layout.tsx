"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { apiService } from "@/services/api-service"
import MenuSection from "./menu-section"
import BillSummary from "./bill-summary"
import ActionBar from "./action-bar"
import { useBillerState } from "@/hooks/use-biller-state"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function BillerLayout() {
  const { logout } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)

  const { bill, addItem, removeItem, updateQuantity, clearBill, applyDiscount } = useBillerState()

  // Load categories and items
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const [cats, menuItems] = await Promise.all([apiService.getMenuCategories(), apiService.getMenuItems()])
        setCategories(cats)
        setItems(menuItems)
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id)
        }
      } catch (error) {
        toast({
          title: "Error loading menu",
          description: "Failed to load menu items. Check your connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMenu()
  }, [toast])

  const handleAddItem = useCallback(
    (item: any) => {
      addItem(item)
      toast({
        title: "Item added",
        description: `${item.name} added to bill`,
        duration: 1000,
      })
    },
    [addItem, toast],
  )

  const handleSubmitBill = useCallback(
    async (whatsappNumber: string, sendViaWhatsapp: boolean) => {
      if (bill.items.length === 0) {
        toast({
          title: "Empty bill",
          description: "Add items before printing",
          variant: "destructive",
        })
        return
      }

      setIsPrinting(true)

      try {
        // Submit bill
        const billData = {
          items: bill.items,
          subtotal: bill.subtotal,
          tax: bill.tax,
          discount: bill.discount,
          total: bill.total,
          whatsappNumber: sendViaWhatsapp ? whatsappNumber : null,
        }

        const result = await apiService.createBill(billData)

        // Print bill
        try {
          window.print?.()
        } catch (printError) {
          console.error("Print error:", printError)
        }

        // Send WhatsApp if enabled
        if (sendViaWhatsapp && whatsappNumber) {
          try {
            // In production, integrate with WhatsApp API
            console.log("Would send WhatsApp to:", whatsappNumber)
          } catch (whatsappError) {
            toast({
              title: "WhatsApp error",
              description: "Message not sent, but bill was saved",
              variant: "destructive",
            })
          }
        }

        toast({
          title: "Bill completed",
          description: `Bill #${result.id} successfully created`,
        })

        // Clear bill
        clearBill()
      } catch (error) {
        toast({
          title: "Error submitting bill",
          description: "Failed to create bill. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsPrinting(false)
      }
    },
    [bill, toast, clearBill],
  )

  useKeyboardShortcuts({
    "?": () => {
      // Show keyboard shortcuts help
      toast({
        title: "Keyboard Shortcuts",
        description: "Esc: Cancel bill | Enter: Focus print button",
      })
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="mt-4 text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  const filteredItems = selectedCategory ? items.filter((item) => item.categoryId === selectedCategory) : items

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
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
            <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Restaurant POS</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Press ? for keyboard shortcuts</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="text-xs sm:text-sm text-muted-foreground hover:text-foreground px-2 sm:px-0 whitespace-nowrap ml-2"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Menu (Full width on mobile, 70% on desktop) */}
        <div className="flex-1 lg:flex-none lg:w-[70%] flex flex-col overflow-hidden">
          <MenuSection
            categories={categories}
            items={filteredItems}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddItem={handleAddItem}
          />
        </div>

        {/* Right Panel - Bill Summary (Hidden on mobile, shown in sheet) */}
        <div className="hidden lg:flex lg:w-[30%]">
          <BillSummary
            bill={bill}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            onApplyDiscount={applyDiscount}
          />
        </div>
      </div>

      {/* Mobile Bill Summary Button - Only visible on mobile */}
      <div className="lg:hidden fixed bottom-24 sm:bottom-28 left-0 right-0 px-3 sm:px-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              className="w-full bg-primary text-primary-foreground font-bold shadow-lg h-12 sm:h-14 text-sm sm:text-base"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                View Bill
                {bill.items.length > 0 && (
                  <Badge variant="secondary" className="bg-primary-foreground text-primary text-xs">
                    {bill.items.length}
                  </Badge>
                )}
                {bill.total > 0 && (
                  <span className="font-bold">${bill.total.toFixed(2)}</span>
                )}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0 max-h-[85vh]">
            <BillSummary
              bill={bill}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
              onApplyDiscount={applyDiscount}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Action Bar */}
      <ActionBar bill={bill} onSubmit={handleSubmitBill} onCancel={clearBill} isSubmitting={isPrinting} />
    </div>
  )
}
