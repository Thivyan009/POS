"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateFilterProps {
  dateRange: { from?: Date; to?: Date }
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void
}

export default function DateFilter({ dateRange, onDateRangeChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      onDateRangeChange(range)
    }
  }

  const clearFilter = () => {
    onDateRangeChange({})
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[280px] justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3">
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="rounded-md border-0"
          />
          <div className="flex items-center justify-between gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilter}
              className="flex-1"
              disabled={!dateRange.from && !dateRange.to}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}






