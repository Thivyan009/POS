"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopItemsProps {
  items: Array<{ name: string; count: number }>
}

export default function TopItems({ items }: TopItemsProps) {
  const maxCount = Math.max(...items.map((i) => i.count), 1)

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div key={item.name} className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-foreground truncate pr-2">{item.name}</span>
                <span className="text-muted-foreground font-semibold flex-shrink-0">{item.count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
