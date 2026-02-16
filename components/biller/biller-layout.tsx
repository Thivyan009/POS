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
import BillerDashboard from "./biller-dashboard"
import ReceiptPreviewDialog from "./receipt-preview-dialog"
import CustomerDetailsDialog from "./customer-details-dialog"
import { useBillerState } from "@/hooks/use-biller-state"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BillerLayout() {
  const { logout, getUser } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewBillData, setPreviewBillData] = useState<{ bill: any; billId?: string; createdAt?: string } | null>(null)
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null)
  const [birthdayAlertOpen, setBirthdayAlertOpen] = useState(false)
  const [birthdayCustomerName, setBirthdayCustomerName] = useState("")
  const [currentView, setCurrentView] = useState<"billing" | "dashboard">("billing")

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


  const handleCustomerSelected = useCallback(
    (customerId: string | null, customerName?: string | null) => {
      setSelectedCustomerId(customerId)
      setSelectedCustomerName(customerName || null)
      setCustomerDialogOpen(false)
      
      if (customerId && customerName) {
        toast({
          title: "Customer added",
          description: `${customerName} has been linked to this bill`,
        })
      }
    },
    [toast],
  )

  const handlePreviewClick = useCallback(() => {
    if (bill.items.length === 0) {
      toast({
        title: "Empty bill",
        description: "Add items before previewing",
        variant: "destructive",
      })
      return
    }

    // Generate a temporary bill ID for preview
    const tempBillId = `PREVIEW-${Date.now().toString(36)}`
    setPreviewBillData({
      bill: bill,
      billId: tempBillId,
      createdAt: new Date().toISOString(),
    })
    setPreviewDialogOpen(true)
  }, [bill, toast])

  const handlePrintFromPreview = useCallback(async () => {
    if (!previewBillData) return

    setIsPrinting(true)
    try {
      const currentUser = getUser()
      const billData = {
        items: previewBillData.bill.items,
        subtotal: previewBillData.bill.subtotal,
        tax: previewBillData.bill.tax,
        discount: previewBillData.bill.discount,
        total: previewBillData.bill.total,
        customerId: selectedCustomerId || null,
        createdBy: currentUser?.id || null,
      }

      const result = await apiService.createBill(billData)

      // Update preview with real bill id so printed receipt shows correct number
      setPreviewBillData({
        bill: previewBillData.bill,
        billId: result.id,
        createdAt: result.createdAt ?? new Date().toISOString(),
      })

      // Let React render the updated receipt, then open print dialog (only receipt is visible via @media print)
      await new Promise((r) => setTimeout(r, 300))
      try {
        window.print()
      } catch (printError) {
        console.error("Print error:", printError)
      }

      toast({
        title: "Bill completed",
        description: `Bill #${result.id} successfully created`,
      })

      setTimeout(() => {
        clearBill()
        setPreviewBillData(null)
        setPreviewDialogOpen(false)
        setSelectedCustomerId(null)
        setSelectedCustomerName(null)
      }, 1500)
    } catch (error) {
      toast({
        title: "Error submitting bill",
        description: "Failed to create bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPrinting(false)
    }
  }, [previewBillData, toast, clearBill, getUser, selectedCustomerId])

  const handleBirthdayDetected = useCallback((customerName: string) => {
    console.log("Birthday detected for:", customerName)
    setBirthdayCustomerName(customerName)
    setBirthdayAlertOpen(true)
  }, [])

  useKeyboardShortcuts({
    "?": () => {
      // Show keyboard shortcuts help
      toast({
        title: "Keyboard Shortcuts",
        description: "Esc: Cancel bill. Use Preview to view and print receipt.",
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

  // Filter items: if searching, show all matching items across all categories
  // Otherwise, filter by selected category
  const filteredItems = items.filter((item) => {
    if (searchQuery) {
      // When searching, ignore category filter and search across all items
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      // When not searching, filter by selected category
      return !selectedCategory || item.categoryId === selectedCategory
    }
  })

  // Show message if no categories or items
  if (categories.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center p-4">
          <p className="text-lg font-semibold text-foreground mb-2">No menu categories found</p>
          <p className="text-sm text-muted-foreground">Please add menu categories in the admin panel.</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center p-4">
          <p className="text-lg font-semibold text-foreground mb-2">No menu items found</p>
          <p className="text-sm text-muted-foreground">Please add menu items in the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card p-3 sm:p-4 md:p-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <Image
            src="/restaurant-logo.png"
            alt="Restaurant Logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground truncate">Paruthimunai Restaurant</h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground hidden sm:block">Press ? for keyboard shortcuts</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-xs sm:text-sm md:text-base text-muted-foreground hover:text-foreground px-2 sm:px-3 md:px-4 py-2 md:py-2 min-h-[44px] sm:min-h-0 whitespace-nowrap ml-2 rounded-md hover:bg-muted transition-colors touch-manipulation"
        >
          Logout
        </button>
      </div>

      {/* View Navigation */}
      <div className="border-b border-border bg-card px-3 sm:px-4 md:px-5">
        <div className="flex gap-2 py-2">
          <button
            type="button"
            onClick={() => setCurrentView("billing")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md border ${
              currentView === "billing"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
          >
            Billing
          </button>
          <button
            type="button"
            onClick={() => setCurrentView("dashboard")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md border ${
              currentView === "dashboard"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
          >
            Today&apos;s Sales
          </button>
        </div>
      </div>

      {/* Main Content */}
      {currentView === "billing" ? (
        <>
          <div className="flex flex-1 overflow-hidden w-full">
            {/* Left Panel - Menu (Full width on mobile, 65% on tablet+, 70% on desktop) */}
            <div className="flex-1 md:w-[65%] lg:w-[70%] flex flex-col overflow-hidden min-w-0">
              <MenuSection
                categories={categories}
                items={filteredItems}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onAddItem={handleAddItem}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Right Panel - Bill Summary (Hidden on mobile, 35% on tablet+, 30% on desktop) */}
            <div className="hidden md:flex md:w-[35%] lg:w-[30%] min-w-0 flex-shrink-0">
              <BillSummary
                bill={bill}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
                onApplyDiscount={applyDiscount}
                onAddCustomer={() => setCustomerDialogOpen(true)}
                customerName={selectedCustomerName}
              />
            </div>
          </div>

          {/* Mobile Bill Summary Button - Static above action bar */}
          <div className="md:hidden border-t border-border bg-card px-3 sm:px-4 py-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="w-full bg-primary text-primary-foreground font-bold shadow-sm h-12 sm:h-14 text-sm sm:text-base"
                  size="lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    View Bill
                    {bill.items.length > 0 && (
                      <Badge variant="secondary" className="bg-primary-foreground text-primary text-xs sm:text-sm">
                        {bill.items.length}
                      </Badge>
                    )}
                    {bill.total > 0 && (
                      <span className="font-bold text-sm sm:text-base">LKR {bill.total.toFixed(2)}</span>
                    )}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0 max-h-[85vh] overflow-hidden">
                <BillSummary
                  bill={bill}
                  onRemoveItem={removeItem}
                  onUpdateQuantity={updateQuantity}
                  onApplyDiscount={applyDiscount}
                  onAddCustomer={() => setCustomerDialogOpen(true)}
                  customerName={selectedCustomerName}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Bottom Action Bar */}
          <ActionBar
            bill={bill}
            onCancel={clearBill}
            onPreview={handlePreviewClick}
          />
        </>
      ) : (
        <BillerDashboard />
      )}

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        onCustomerSelected={handleCustomerSelected}
        onBirthdayDetected={handleBirthdayDetected}
        proceedWithPrint={false}
      />

      {/* Birthday Alert Dialog */}
      <AlertDialog open={birthdayAlertOpen} onOpenChange={setBirthdayAlertOpen}>
        <AlertDialogContent className="z-[100]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">🎉 Happy Birthday! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="text-lg pt-2">
              {birthdayCustomerName || "Customer"} is celebrating their birthday today!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setBirthdayAlertOpen(false)} className="min-h-[44px] sm:min-h-0">Continue</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Preview Dialog - Print uses @media print to show only receipt */}
      {previewBillData && (
        <ReceiptPreviewDialog
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
          bill={previewBillData.bill}
          billId={previewBillData.billId}
          createdAt={previewBillData.createdAt}
          onPrint={handlePrintFromPreview}
          isPrinting={isPrinting}
        />
      )}
    </div>
  )
}
