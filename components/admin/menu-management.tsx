"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MenuCategoryForm from "./menu-category-form"
import MenuItemForm from "./menu-item-form"
import CategoryList from "./category-list"
import ItemList from "./item-list"

export default function MenuManagement() {
  const [categories, setCategories] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cats, menuItems] = await Promise.all([apiService.getMenuCategories(), apiService.getMenuItems()])
      setCategories(cats)
      setItems(menuItems)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySave = async (category: any) => {
    try {
      if (editingCategory) {
        const updated = await apiService.updateMenuCategory(editingCategory.id, { name: category.name })
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)))
        toast({ title: "Success", description: "Category updated" })
      } else {
        const newCategory = await apiService.createMenuCategory({ name: category.name })
        setCategories([...categories, newCategory])
        toast({ title: "Success", description: "Category added" })
      }
      setShowCategoryForm(false)
      setEditingCategory(null)
    } catch (error) {
      toast({
        title: "Error",
        description: editingCategory ? "Failed to update category" : "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      await apiService.deleteMenuCategory(categoryId)
      setCategories(categories.filter((c) => c.id !== categoryId))
      // Remove items in this category
      setItems(items.filter((i) => i.categoryId !== categoryId))
      toast({ title: "Success", description: "Category deleted" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleItemSave = async (item: any) => {
    try {
      if (editingItem) {
        const updated = await apiService.updateMenuItem(editingItem.id, {
          name: item.name,
          price: item.price,
          categoryId: item.categoryId,
          tax: item.tax,
          available: item.available,
        })
        setItems(items.map((i) => (i.id === updated.id ? updated : i)))
        toast({ title: "Success", description: "Item updated" })
      } else {
        const newItem = await apiService.createMenuItem({
          name: item.name,
          price: item.price,
          categoryId: item.categoryId,
          tax: item.tax,
          available: item.available,
        })
        setItems([...items, newItem])
        toast({ title: "Success", description: "Item added" })
      }
      setShowItemForm(false)
      setEditingItem(null)
    } catch (error) {
      toast({
        title: "Error",
        description: editingItem ? "Failed to update item" : "Failed to create item",
        variant: "destructive",
      })
    }
  }

  const handleItemDelete = async (itemId: string) => {
    try {
      await apiService.deleteMenuItem(itemId)
      setItems(items.filter((i) => i.id !== itemId))
      toast({ title: "Success", description: "Item deleted" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="mt-4 text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Menu Management</h2>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base sm:text-lg">Categories</CardTitle>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setShowCategoryForm(!showCategoryForm)
              }}
              size="sm"
              className="text-xs sm:text-sm"
            >
              + Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          {showCategoryForm && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <MenuCategoryForm
                category={editingCategory}
                onSave={handleCategorySave}
                onCancel={() => {
                  setShowCategoryForm(false)
                  setEditingCategory(null)
                }}
              />
            </div>
          )}

          <CategoryList
            categories={categories}
            onEdit={(category) => {
              setEditingCategory(category)
              setShowCategoryForm(true)
            }}
            onDelete={handleCategoryDelete}
          />
        </CardContent>
      </Card>

      {/* Menu Items Section */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base sm:text-lg">Menu Items</CardTitle>
            <Button
              onClick={() => {
                setEditingItem(null)
                setShowItemForm(!showItemForm)
              }}
              size="sm"
              className="text-xs sm:text-sm"
            >
              + Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          {showItemForm && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <MenuItemForm
                item={editingItem}
                categories={categories}
                onSave={handleItemSave}
                onCancel={() => {
                  setShowItemForm(false)
                  setEditingItem(null)
                }}
              />
            </div>
          )}

          <ItemList
            items={items}
            categories={categories}
            onEdit={(item) => {
              setEditingItem(item)
              setShowItemForm(true)
            }}
            onDelete={handleItemDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
