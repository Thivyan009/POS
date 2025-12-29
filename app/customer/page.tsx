"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/services/api-service"
import CustomerMenu from "@/components/customer/customer-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { UtensilsCrossed } from "lucide-react"

export default function CustomerPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      const [cats, menuItems] = await Promise.all([
        apiService.getMenuCategories(),
        apiService.getMenuItems(),
      ])
      setCategories(cats)
      // Add placeholder images to items that don't have images
      const itemsWithImages = menuItems.map((item: any) => ({
        ...item,
        imageUrl: item.imageUrl || "/placeholder.jpg",
      }))
      setItems(itemsWithImages)
    } catch (error) {
      console.error("Failed to load menu data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.categoryId === selectedCategory)

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 hidden sm:block" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Category Filter Skeleton */}
        <div className="sticky top-16 sm:top-20 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 py-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col rounded-2xl overflow-hidden border border-border/50">
                  <Skeleton className="w-full aspect-[4/3]" />
                  <div className="p-4 sm:p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerMenu
        categories={categories}
        items={filteredItems}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </div>
  )
}
