"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface MenuSectionProps {
  categories: any[]
  items: any[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  onAddItem: (item: any) => void
}

export default function MenuSection({
  categories,
  items,
  selectedCategory,
  onSelectCategory,
  onAddItem,
}: MenuSectionProps) {
  return (
    <div className="flex flex-1 flex-col border-r border-border p-2 sm:p-4 md:p-6 w-full min-w-0">
      {/* Category Tabs */}
      <div className="mb-3 sm:mb-4 md:mb-5 flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide flex-shrink-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`whitespace-nowrap rounded-lg px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-medium transition-colors flex-shrink-0 ${
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <ScrollArea className="flex-1 w-full min-w-0">
        <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 p-1 sm:p-2 w-full auto-rows-max">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onAddItem(item)}
              disabled={!item.available}
              className={`w-full rounded-lg border overflow-hidden text-left transition-colors active:scale-95 ${
                item.available
                  ? "border-border bg-card hover:bg-muted cursor-pointer"
                  : "border-border/50 bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
              }`}
            >
              {item.imageUrl && (
                <div className="relative w-full h-32 sm:h-40 md:h-44 lg:h-48 bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized={item.imageUrl.startsWith("data:")}
                  />
                </div>
              )}
              <div className="p-2.5 sm:p-3 md:p-4">
                <div className="font-medium text-foreground text-sm sm:text-base md:text-lg line-clamp-2">{item.name}</div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-primary mt-1.5 sm:mt-2">LKR {item.price.toFixed(2)}</div>
                {!item.available && <div className="text-xs sm:text-sm text-muted-foreground mt-1">Out of Stock</div>}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
