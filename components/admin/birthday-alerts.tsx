"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/services/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Cake, MessageSquare } from "lucide-react"

export default function BirthdayAlerts() {
  const [birthdayCustomers, setBirthdayCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingSMS, setIsSendingSMS] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadBirthdayCustomers()
  }, [])

  const loadBirthdayCustomers = async () => {
    setIsLoading(true)
    try {
      const customers = await apiService.getBirthdayCustomers()
      setBirthdayCustomers(customers)
    } catch (error: any) {
      console.error("Error loading birthday customers:", error)
      // Silently fail - this is just an alert, not critical functionality
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendSMS = async () => {
    if (birthdayCustomers.length === 0) {
      toast({
        title: "No customers",
        description: "No birthday customers to send SMS to",
        variant: "destructive",
      })
      return
    }

    setIsSendingSMS(true)
    try {
      const customerIds = birthdayCustomers.map((customer) => customer.id)
      const result = await apiService.sendBirthdaySMS(customerIds)

      if (result.errors && result.errors.length > 0) {
        toast({
          title: "Partial success",
          description: `Sent to ${result.sent} customer(s), ${result.failed} failed`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "SMS sent successfully",
          description: `Birthday SMS sent to ${result.sent} customer(s)`,
        })
      }
    } catch (error: any) {
      console.error("Error sending birthday SMS:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to send birthday SMS",
        variant: "destructive",
      })
    } finally {
      setIsSendingSMS(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5" />
            Today's Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (birthdayCustomers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5" />
            Today's Birthdays
          </CardTitle>
          <CardDescription>No birthdays today</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-5 w-5 text-primary" />
          Today's Birthdays
            <Badge variant="secondary" className="ml-2">
            {birthdayCustomers.length}
          </Badge>
        </CardTitle>
          <Button
            onClick={handleSendSMS}
            disabled={isSendingSMS || birthdayCustomers.length === 0}
            size="sm"
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {isSendingSMS ? "Sending..." : "Send SMS"}
          </Button>
        </div>
        <CardDescription>Customers celebrating their birthday today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {birthdayCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-2 rounded-lg bg-background border"
            >
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
              <Badge variant="default" className="bg-primary">
                🎉 Birthday
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

