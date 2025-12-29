"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MenuCategoryFormProps {
  category?: any
  onSave: (category: any) => void
  onCancel: () => void
}

export default function MenuCategoryForm({ category, onSave, onCancel }: MenuCategoryFormProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (category) {
      setName(category.name)
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      ...(category || {}),
      name: name.trim(),
    })
    setName("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Category Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Appetizers, Main Course"
          autoFocus
          className="text-sm sm:text-base h-9 sm:h-10"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" disabled={!name.trim()} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base h-9 sm:h-10">
          {category ? "Update" : "Add"} Category
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" className="text-sm sm:text-base h-9 sm:h-10">
          Cancel
        </Button>
      </div>
    </form>
  )
}
