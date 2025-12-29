"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface CustomerMenuProps {
  categories: any[]
  items: any[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

export default function CustomerMenu({
  categories,
  items,
  selectedCategory,
  onSelectCategory,
}: CustomerMenuProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 lg:py-6">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Our Menu
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
                Discover our delicious offerings
              </p>
            </div>
            {items.length > 0 && (
              <div className="text-right shrink-0">
                <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Category Tabs */}
        <div className="border-b border-border bg-card sticky top-0 z-10 shrink-0">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4">
              <div className="flex gap-2 sm:gap-3 py-3 sm:py-4 min-w-max">
                <button
                  onClick={() => onSelectCategory("all")}
                  className={`whitespace-nowrap rounded-lg px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base font-medium transition-colors flex-shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-muted active:bg-muted"
                  }`}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`whitespace-nowrap rounded-lg px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base font-medium transition-colors flex-shrink-0 ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-muted active:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-20">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🍽️</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-2 text-center">
                  No items found
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base text-center px-4">
                  Please check back later
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group rounded-lg sm:rounded-xl border overflow-hidden bg-card shadow-sm transition-all hover:shadow-md ${
                      !item.available
                        ? "opacity-60 border-border/50"
                        : "border-border"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-full h-40 sm:h-48 lg:h-56 bg-muted overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={
                          item.imageUrl?.startsWith("data:") || !item.imageUrl
                        }
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="text-xs sm:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1"
                          >
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground mb-1.5 sm:mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                          LKR {item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-2 sm:py-3 lg:py-4 shrink-0">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {new Date().getFullYear()} Restaurant Menu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
