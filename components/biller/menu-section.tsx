"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface MenuSectionProps {
  categories: any[]
  items: any[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  onAddItem: (item: any) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function MenuSection({
  categories,
  items,
  selectedCategory,
  onSelectCategory,
  onAddItem,
  searchQuery,
  onSearchChange,
}: MenuSectionProps) {
  return (
    <div className="flex flex-1 flex-col border-r border-border p-2 sm:p-4 md:p-6 w-full min-w-0 overflow-hidden">
      {/* Search Bar */}
      <div className="mb-3 sm:mb-4 md:mb-5 flex-shrink-0">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9 h-10 sm:h-11 text-sm sm:text-base"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 hover:bg-muted"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-3 sm:mb-4 md:mb-5 flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide flex-shrink-0">
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`whitespace-nowrap rounded-lg px-3 sm:px-4 md:px-5 py-2.5 sm:py-2 md:py-2.5 min-h-[44px] sm:min-h-0 text-xs sm:text-sm md:text-base font-medium transition-colors flex-shrink-0 ${
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
      <ScrollArea className="flex-1 w-full min-w-0 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-4 text-center">
            <SearchIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-base sm:text-lg font-medium text-foreground mb-2">
              {searchQuery ? "No items found" : "No items in this category"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? `Try searching for something else or clear your search.`
                : "Select a different category or add items in the admin panel."}
            </p>
          </div>
        ) : (
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 p-1 sm:p-2 w-full auto-rows-max">
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onAddItem(item)}
                disabled={!item.available}
                className={`w-full rounded-lg border overflow-hidden text-left transition-colors active:scale-95 min-h-[44px] sm:min-h-0 ${
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
        )}
      </ScrollArea>
    </div>
  )
}
