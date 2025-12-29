"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RevenueCardsProps {
  data: {
    today: number
    thisWeek: number
    thisMonth: number
  }
}

export default function RevenueCards({ data }: RevenueCardsProps) {
  const cards = [
    { label: "Today", value: data.today },
    { label: "This Week", value: data.thisWeek },
    { label: "This Month", value: data.thisMonth },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              LKR {card.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
