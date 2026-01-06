"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesChartProps {
  data: Array<{ hour: string; sales: number }>
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Sales by Hour</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <p className="text-sm text-muted-foreground">No sales data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort by hour to ensure stable order
  const sorted = [...data].sort((a, b) => a.hour.localeCompare(b.hour))
  const maxSales = Math.max(...sorted.map((d) => d.sales), 1)

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Sales by Hour</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 sm:h-64 overflow-x-auto px-1">
          {sorted.map((item, index) => {
            const showHourLabel = index % 2 === 0 // show every 2nd hour label to reduce clutter
            const barHeight = (item.sales / maxSales) * 100

            return (
              <div
                key={index}
                className="flex-1 min-w-[22px] sm:min-w-[26px] flex flex-col items-center gap-1 sm:gap-1.5"
                title={item.sales > 0 ? `${item.hour} • LKR ${item.sales.toFixed(2)}` : item.hour}
              >
              <div
                  className="w-full rounded-t bg-primary/70 hover:bg-primary transition-all"
                  style={{
                    height: `${barHeight}%`,
                    minHeight: item.sales > 0 ? "6px" : "2px",
                  }}
                />
                <span
                  className={`text-[9px] sm:text-[10px] text-muted-foreground font-medium ${
                    showHourLabel ? "" : "opacity-0 sm:opacity-50"
                  }`}
                >
                  {item.hour}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
