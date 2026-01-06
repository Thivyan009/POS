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
import PrintableBill from "./printable-bill"
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
  const [isLoading, setIsLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [printBillData, setPrintBillData] = useState<{ bill: any; billId?: string; createdAt?: string } | null>(null)
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

  const handlePrintClick = useCallback(async () => {
    if (bill.items.length === 0) {
      toast({
        title: "Empty bill",
        description: "Add items before printing",
        variant: "destructive",
      })
      return
    }

    // Print bill directly - customer is optional
    setIsPrinting(true)

    try {
      // Get current user for created_by field
      const currentUser = getUser()
      
      // Submit bill (with or without customer)
      const billData = {
        items: bill.items,
        subtotal: bill.subtotal,
        tax: bill.tax,
        discount: bill.discount,
        total: bill.total,
        customerId: selectedCustomerId || null,
        createdBy: currentUser?.id || null,
      }

      const result = await apiService.createBill(billData)

      // Set print data before printing
      setPrintBillData({
        bill: bill,
        billId: result.id,
        createdAt: result.createdAt || new Date().toISOString(),
      })

      // Print to thermal printer (XP-E200L 80mm)
      // The receipt is formatted for 80mm thermal paper
      // Select "XP-E200L" or your thermal printer in the print dialog
      setTimeout(() => {
        try {
          window.print?.()
        } catch (printError) {
          console.error("Print error:", printError)
        }
      }, 150)

      toast({
        title: "Bill completed",
        description: `Bill #${result.id} successfully created`,
      })

      // Clear bill after a short delay to allow print dialog to open
      setTimeout(() => {
        clearBill()
        setPrintBillData(null)
        setSelectedCustomerId(null)
        setSelectedCustomerName(null)
      }, 500)
    } catch (error) {
      toast({
        title: "Error submitting bill",
        description: "Failed to create bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPrinting(false)
    }
  }, [bill, toast, clearBill, getUser, selectedCustomerId])

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

      setPrintBillData({
        bill: previewBillData.bill,
        billId: result.id,
        createdAt: result.createdAt || new Date().toISOString(),
      })

      setTimeout(() => {
        try {
          window.print?.()
        } catch (printError) {
          console.error("Print error:", printError)
        }
      }, 150)

      toast({
        title: "Bill completed",
        description: `Bill #${result.id} successfully created`,
      })

      setTimeout(() => {
        clearBill()
        setPrintBillData(null)
        setPreviewBillData(null)
        setPreviewDialogOpen(false)
        setSelectedCustomerId(null)
        setSelectedCustomerName(null)
      }, 500)
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
      <div className="flex items-center justify-between border-b border-border bg-card p-3 sm:p-4 md:p-5">
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
          onClick={logout} 
          className="text-xs sm:text-sm md:text-base text-muted-foreground hover:text-foreground px-2 sm:px-3 md:px-4 py-1.5 md:py-2 whitespace-nowrap ml-2 rounded-md hover:bg-muted transition-colors"
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

          {/* Mobile Bill Summary Button - Only visible on mobile */}
          <div className="md:hidden fixed bottom-24 sm:bottom-28 left-0 right-0 px-3 sm:px-4 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="w-full bg-primary text-primary-foreground font-bold shadow-lg h-12 sm:h-14 text-sm sm:text-base"
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
              <SheetContent side="bottom" className="h-[85vh] p-0 max-h-[85vh]">
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
            onSubmit={handlePrintClick}
            onCancel={clearBill}
            onPreview={handlePreviewClick}
            isSubmitting={isPrinting}
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
            <Button onClick={() => setBirthdayAlertOpen(false)}>Continue</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Preview Dialog */}
      {previewBillData && (
        <ReceiptPreviewDialog
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
          bill={previewBillData.bill}
          billId={previewBillData.billId}
          createdAt={previewBillData.createdAt}
          onPrint={handlePrintFromPreview}
        />
      )}

      {/* Printable Bill Receipt - Hidden by default, shown only when printing */}
      {printBillData && (
        <PrintableBill
          bill={printBillData.bill}
          billId={printBillData.billId}
          createdAt={printBillData.createdAt}
        />
      )}
    </div>
  )
}
