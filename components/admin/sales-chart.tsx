"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesChartProps {
  data: Array<{ hour: string; sales: number }>
}

export default function SalesChart({ data }: SalesChartProps) {
  const maxSales = Math.max(...data.map((d) => d.sales), 1)

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Sales by Hour</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 sm:h-64 overflow-x-auto">
          {data.map((item, index) => (
            <div key={index} className="flex-1 min-w-[30px] sm:min-w-0 flex flex-col items-center gap-1 sm:gap-2">
              <div
                className="w-full bg-primary rounded-t transition-all"
                style={{
                  height: `${(item.sales / maxSales) * 100}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{item.hour}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
