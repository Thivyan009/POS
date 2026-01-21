"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { UtensilsCrossed, Mail, Phone } from "lucide-react"

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header - Clean and Minimal */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Image
                src="/restaurant-logo.png"
                alt="Restaurant Logo"
                width={48}
                height={48}
                className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 object-contain flex-shrink-0"
                priority
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-foreground truncate">
                  Our Menu
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">
                  Discover our delicious offerings
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted flex-shrink-0 ml-2">
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

      {/* Category Filter Bar - Sticky below header */}
      <div className="sticky top-14 sm:top-16 md:top-20 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 sm:gap-3 py-3 sm:py-4 min-w-max">
              <button
                onClick={() => onSelectCategory("all")}
                className={`relative whitespace-nowrap rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-200 flex-shrink-0 ${
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
                  className={`relative whitespace-nowrap rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-200 flex-shrink-0 ${
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

      {/* Menu Items Grid - Main content area with proper spacing */}
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
          {items.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Empty className="border-0 py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10" />
                  </EmptyMedia>
                  <EmptyTitle>No items found</EmptyTitle>
                  <EmptyDescription>
                    {selectedCategory === "all"
                      ? "We're currently updating our menu. Please check back soon."
                      : "No items available in this category. Try selecting a different category."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-card border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 ${
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
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
                  <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">
                    <h3 className="font-semibold text-base sm:text-lg md:text-xl text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="mt-auto pt-2 sm:pt-3">
                      <Separator className="mb-3 sm:mb-4 opacity-50" />
                      <div className="flex items-baseline justify-between gap-2 sm:gap-3">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                            LKR
                          </span>
                          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer - Fixed at bottom, doesn't compress content */}
      <footer className="border-t border-border bg-card mt-auto shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Company Info */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <Image
                  src="/restaurant-logo.png"
                  alt="Restaurant Logo"
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
                />
                <span className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                  ParuthiMunai
                </span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                © {new Date().getFullYear()} All rights reserved
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 text-center sm:text-left">
              <a
                href="tel:+94772748689"
                className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">+94 77 274 8689</span>
                <span className="sm:hidden">Call Us</span>
              </a>
              <a
                href="mailto:paruthimunai@gmail.com"
                className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">paruthimunai@gmail.com</span>
                <span className="sm:hidden">Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
