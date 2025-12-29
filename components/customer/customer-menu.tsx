"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { UtensilsCrossed } from "lucide-react"

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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header - Clean and Minimal */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Our Menu
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Discover our delicious offerings
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <span className="text-sm font-medium text-foreground">
                  {items.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {items.length === 1 ? "item" : "items"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Category Filter Bar - Airbnb Style */}
        <div className="sticky top-16 sm:top-20 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              <div className="flex gap-1 sm:gap-2 py-4 min-w-max">
                <button
                  onClick={() => onSelectCategory("all")}
                  className={`relative whitespace-nowrap rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-muted text-foreground hover:bg-muted/80 active:scale-95"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`relative whitespace-nowrap rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                      selectedCategory === category.id
                        ? "bg-foreground text-background shadow-sm"
                        : "bg-muted text-foreground hover:bg-muted/80 active:scale-95"
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            {items.length === 0 ? (
              <Empty className="border-0 py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UtensilsCrossed className="w-8 h-8" />
                  </EmptyMedia>
                  <EmptyTitle>No items found</EmptyTitle>
                  <EmptyDescription>
                    {selectedCategory === "all"
                      ? "We're currently updating our menu. Please check back soon."
                      : "No items available in this category. Try selecting a different category."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col rounded-2xl overflow-hidden bg-card border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      !item.available
                        ? "opacity-75 border-border/50"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={
                          item.imageUrl?.startsWith("data:") || !item.imageUrl
                        }
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold px-3 py-1 bg-background/90"
                          >
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4 sm:p-5">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="mt-auto pt-2">
                        <Separator className="mb-3 opacity-50" />
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                              LKR
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-foreground">
                              {item.price.toFixed(2)}
                            </span>
                          </div>
                          {item.tax && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 border-muted-foreground/20"
                            >
                              Tax incl.
                            </Badge>
                          )}
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
    </div>
  )
}
