"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/services/api-service"
import CustomerMenu from "@/components/customer/customer-menu"

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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="mt-4 text-muted-foreground">Loading menu...</p>
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
