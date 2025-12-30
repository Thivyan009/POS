"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api-service"
import { format } from "date-fns"
import { CheckCircle2, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomerDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerSelected: (customerId: string | null, customerName?: string | null) => void
  onBirthdayDetected?: (customerName: string) => void
  proceedWithPrint?: boolean // Kept for backward compatibility but not used
}

export default function CustomerDetailsDialog({
  open,
  onOpenChange,
  onCustomerSelected,
  onBirthdayDetected,
  proceedWithPrint = false,
}: CustomerDetailsDialogProps) {
  const { toast } = useToast()
  const [phone, setPhone] = useState("+94")
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setPhone("+94")
      setIsNewCustomer(false)
      setName("")
      setDateOfBirth(undefined)
      setIsSearching(false)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [open])

  const handlePhoneSearch = useCallback(async (showToast: boolean = true) => {
    if (!phone.trim() || phone.trim().length < 10) {
      return
    }

    setIsSearching(true)
    try {
      const customer = await apiService.getCustomerByPhone(phone.trim())
      
      if (customer) {
        // Existing customer found
        setIsNewCustomer(false)
        setName(customer.name)
        if (customer.date_of_birth) {
          // Create date in local timezone for birthday checking
          const [year, month, day] = customer.date_of_birth.split('-').map(Number)
          setDateOfBirth(new Date(year, month - 1, day))
        } else {
          setDateOfBirth(undefined)
        }
        
        // Check if it's their birthday - show alert immediately when customer is found
        if (customer.date_of_birth) {
          const [year, month, day] = customer.date_of_birth.split('-').map(Number)
          const dob = new Date(year, month - 1, day)
          const today = new Date()
          console.log("Checking birthday - DOB:", dob, "Today:", today, "Match:", dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate())
          if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) {
            console.log("Birthday detected for existing customer:", customer.name)
            // Show birthday alert immediately when existing customer is found
            onBirthdayDetected?.(customer.name)
          }
        }
        
        if (showToast) {
          toast({
            title: "Customer found",
            description: `Found: ${customer.name}`,
          })
        }
      } else {
        // New customer
        setIsNewCustomer(true)
        setName("")
        setDateOfBirth(undefined)
        if (showToast) {
          toast({
            title: "New customer",
            description: "Please enter customer details",
          })
        }
      }
    } catch (error) {
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to search for customer",
          variant: "destructive",
        })
      }
    } finally {
      setIsSearching(false)
    }
  }, [phone, toast, onBirthdayDetected])

  // Auto-verify phone number when it's complete
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Only search if phone number is at least 10 characters (including +94)
    if (phone.trim().length >= 10 && phone.trim().startsWith("+94")) {
      // Debounce the search - wait 800ms after user stops typing
      searchTimeoutRef.current = setTimeout(() => {
        handlePhoneSearch(false) // Don't show toast for auto-search
      }, 800)
    } else if (phone.trim().length < 10) {
      // Reset to new customer if phone is too short
      setIsNewCustomer(false)
      setName("")
      setDateOfBirth(undefined)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [phone, handlePhoneSearch])

  const handleSubmit = async () => {
    if (!phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter a phone number",
        variant: "destructive",
      })
      return
    }

    if (isNewCustomer) {
      if (!name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter customer name",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)
    try {
      let customerId: string | null = null
      let customerName: string | null = null

      console.log("handleSubmit - isNewCustomer:", isNewCustomer, "dateOfBirth:", dateOfBirth, "name:", name)

      if (isNewCustomer) {
        // Create new customer
        // Convert Date object to YYYY-MM-DD string format
        const dobValue = dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null
        console.log("Creating customer - dateOfBirth:", dateOfBirth, "dobValue:", dobValue, "type:", typeof dobValue)
        const customer = await apiService.createCustomer({
          name: name.trim(),
          phone: phone.trim(),
          date_of_birth: dobValue,
        })
        customerId = customer.id
        customerName = customer.name
        
        // Check if it's their birthday
        if (dateOfBirth) {
          const today = new Date()
          console.log("Checking birthday for new customer - DOB:", dateOfBirth, "Today:", today, "Match:", dateOfBirth.getMonth() === today.getMonth() && dateOfBirth.getDate() === today.getDate())
          if (dateOfBirth.getMonth() === today.getMonth() && dateOfBirth.getDate() === today.getDate()) {
            console.log("Birthday detected for new customer:", customer.name)
            // Delay to ensure alert shows after dialog closes
            setTimeout(() => {
              onBirthdayDetected?.(customer.name)
            }, 300)
          }
        }
      } else {
        // Use existing customer
        const customer = await apiService.getCustomerByPhone(phone.trim())
        customerId = customer?.id || null
        customerName = customer?.name || null
        
        // Check if it's their birthday (for existing customer)
        if (customer?.date_of_birth) {
          const [year, month, day] = customer.date_of_birth.split('-').map(Number)
          const dob = new Date(year, month - 1, day)
          const today = new Date()
          console.log("Checking birthday on submit - DOB:", dob, "Today:", today, "Match:", dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate())
          if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) {
            console.log("Birthday detected on submit for existing customer:", customer.name)
            // Delay to ensure alert shows after dialog closes
            setTimeout(() => {
              onBirthdayDetected?.(customer.name)
            }, 300)
          }
        }
      }

      onCustomerSelected(customerId, customerName)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error in handleSubmit:", error)
      const errorMessage = error?.message || error?.details || error?.hint || "Failed to save customer details"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Allow dialog to close normally - customer entry is optional
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Enter customer phone number to search or add new customer (optional)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+94123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePhoneSearch()
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
            {phone.trim().length >= 10 && phone.trim().startsWith("+94") && !isSearching && (
              <p className="text-xs text-muted-foreground">
                {isNewCustomer ? "New customer - Please enter details below" : "Customer found - Click Continue to proceed"}
              </p>
            )}
          </div>

          {/* New Customer Fields */}
          {isNewCustomer && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Customer name"
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value
                    setName(newName)
                    
                    // If date of birth is today and name is being entered, show birthday alert
                    if (dateOfBirth && newName.trim()) {
                      const today = new Date()
                      if (dateOfBirth.getMonth() === today.getMonth() && dateOfBirth.getDate() === today.getDate()) {
                        // Small delay to ensure it shows properly
                        setTimeout(() => {
                          onBirthdayDetected?.(newName.trim())
                        }, 100)
                      }
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        console.log("Calendar date selected:", date)
                        if (date) {
                          setDateOfBirth(date)
                          
                          // Check if it's their birthday today
                          const today = new Date()
                          if (date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
                            // Show birthday alert immediately - use name if available, otherwise "Customer"
                            const displayName = name.trim() || "Customer"
                            // Small delay to ensure it shows properly
                            setTimeout(() => {
                              onBirthdayDetected?.(displayName)
                            }, 100)
                          }
                        } else {
                          setDateOfBirth(undefined)
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {dateOfBirth && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {format(dateOfBirth, "yyyy-MM-dd")}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Existing Customer Display */}
          {!isNewCustomer && name && !isSearching && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Existing Customer Found</p>
                  <p className="text-sm font-semibold mt-1">{name}</p>
                  {dateOfBirth && (
                    <>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        DOB: {format(dateOfBirth, "PPP")}
                      </p>
                      {/* Show birthday indicator if it's their birthday today */}
                      {(() => {
                        const today = new Date()
                        const dob = dateOfBirth
                        const isBirthdayToday = dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()
                        return isBirthdayToday ? (
                          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-xs font-semibold text-yellow-900 dark:text-yellow-100">
                            🎉 Today is {name}'s birthday! 🎉
                          </div>
                        ) : null
                      })()}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !phone.trim() || (isNewCustomer && !name.trim())}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : "Add Customer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

