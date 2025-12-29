"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface MenuItemFormProps {
  item?: any
  categories: any[]
  onSave: (item: any) => void
  onCancel: () => void
}

export default function MenuItemForm({ item, categories, onSave, onCancel }: MenuItemFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tax, setTax] = useState(true)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    if (item) {
      setName(item.name)
      setPrice(item.price.toString())
      setCategoryId(item.categoryId)
      setTax(item.tax)
      setAvailable(item.available)
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [item, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) return

    onSave({
      ...(item || {}),
      name: name.trim(),
      price: Number.parseFloat(price),
      categoryId,
      tax,
      available,
    })
    setName("")
    setPrice("")
    setCategoryId("")
    setTax(true)
    setAvailable(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Item Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Burger"
            autoFocus
            className="text-sm sm:text-base h-9 sm:h-10"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Price</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="9.99"
            step="0.01"
            min="0"
            className="text-sm sm:text-base h-9 sm:h-10"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base h-9 sm:h-10 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={tax} onCheckedChange={(checked) => setTax(!!checked)} />
          <span className="text-xs sm:text-sm text-foreground">Apply Tax</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={available} onCheckedChange={(checked) => setAvailable(!!checked)} />
          <span className="text-xs sm:text-sm text-foreground">Available</span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
          disabled={!name.trim() || !price || !categoryId}
          className="bg-green-600 hover:bg-green-700 text-sm sm:text-base h-9 sm:h-10"
        >
          {item ? "Update" : "Add"} Item
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" className="text-sm sm:text-base h-9 sm:h-10">
          Cancel
        </Button>
      </div>
    </form>
  )
}
