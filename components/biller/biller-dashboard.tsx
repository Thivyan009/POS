"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BillerDailyStats {
  date: string
  totalSales: number
  grossSales: number
  taxCollected: number
  discountGiven: number
  billsCount: number
  averageBill: number
  bills: Array<{
    id: string
    subtotal: number
    tax: number
    discount: number
    total: number
    createdAt: string
  }>
}

export default function BillerDashboard() {
  const { getUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<BillerDailyStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      try {
        const user = getUser()
        if (!user) {
          setStats(null)
          return
        }

        const data = await apiService.getBillerDailyStats(user.id)
        setStats(data)
      } catch (error) {
        console.error("Failed to load biller daily stats:", error)
        toast({
          title: "Error",
          description: "Failed to load today's sales. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [getUser, toast])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-3xl sm:text-4xl">⚙️</div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading today&apos;s sales...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm sm:text-base text-muted-foreground">
          No sales data available. Create a bill to see your daily sales summary.
        </p>
      </div>
    )
  }

  const formattedDate = new Date(stats.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Today&apos;s Sales</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Your sales performance for {formattedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Sales (Collected)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              LKR{" "}
              {stats.totalSales.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gross Sales (Before Discount)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              LKR{" "}
              {stats.grossSales.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Discount Given</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              LKR{" "}
              {stats.discountGiven.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bills Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.billsCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-medium">Today&apos;s Bills</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {stats.billsCount} bill{stats.billsCount === 1 ? "" : "s"} &middot; Average bill:{" "}
              LKR{" "}
              {stats.averageBill.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {stats.bills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bills created today.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-auto">
              {stats.bills.map((bill) => {
                const time = new Date(bill.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                return (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">Bill #{String(bill.id).slice(0, 8)}</span>
                      <span className="text-xs text-muted-foreground">{time}</span>
                      <span className="text-xs text-muted-foreground">
                        Subtotal:{" "}
                        LKR{" "}
                        {bill.subtotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        &middot; Discount:{" "}
                        LKR{" "}
                        {bill.discount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      LKR{" "}
                      {bill.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


