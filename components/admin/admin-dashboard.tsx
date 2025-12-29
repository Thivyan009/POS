"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/services/api-service"
import AdminHeader from "./admin-header"
import AdminNav from "./admin-nav"
import RevenueCards from "./revenue-cards"
import SalesChart from "./sales-chart"
import TopItems from "./top-items"
import RecentBills from "./recent-bills"
import MenuManagement from "./menu-management"
import UserManagement from "./user-management"
import DateFilter from "./date-filter"
import DiscountCodeManagement from "./discount-code-management"

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [revenue, setRevenue] = useState({ today: 0, thisWeek: 0, thisMonth: 0 })
  const [salesByHour, setSalesByHour] = useState([])
  const [topItems, setTopItems] = useState([])
  const [currentSection, setCurrentSection] = useState("overview")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rev, sales, items] = await Promise.all([
          apiService.getRevenue(dateRange.from, dateRange.to),
          apiService.getSalesByHour(dateRange.from, dateRange.to),
          apiService.getTopItems(dateRange.from, dateRange.to),
        ])
        setRevenue(rev)
        setSalesByHour(sales)
        setTopItems(items)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast, dateRange])

  return (
    <div className="flex h-screen flex-col bg-background">
      <AdminHeader onLogout={logout} />

      <div className="flex flex-1 overflow-hidden">
        <AdminNav currentSection={currentSection} onSelectSection={setCurrentSection} />

        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
          {currentSection === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h2>
                <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-48 sm:h-64">
                  <div className="text-center">
                    <div className="animate-spin text-3xl sm:text-4xl">⚙️</div>
                    <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading data...</p>
                  </div>
                </div>
              ) : (
                <>
                  <RevenueCards data={revenue} />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2">
                      <SalesChart data={salesByHour} />
                    </div>
                    <div>
                      <TopItems items={topItems} />
                    </div>
                  </div>
                  <RecentBills />
                </>
              )}
            </div>
          )}

          {currentSection === "menu" && <MenuManagement />}

          {currentSection === "users" && <UserManagement />}

          {currentSection === "bills" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Bill History</h2>
                <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
              </div>
              <RecentBills dateRange={dateRange} />
            </div>
          )}

          {currentSection === "discounts" && <DiscountCodeManagement />}
        </main>
      </div>
    </div>
  )
}
