"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/services/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cake } from "lucide-react"

export default function BirthdayAlerts() {
  const [birthdayCustomers, setBirthdayCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-5 w-5 text-primary" />
          Today's Birthdays
          <Badge variant="secondary" className="ml-auto">
            {birthdayCustomers.length}
          </Badge>
        </CardTitle>
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

