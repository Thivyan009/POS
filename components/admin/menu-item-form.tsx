"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const [imagePreview, setImagePreview] = useState<string | null>(item?.imageUrl || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [oldImagePath, setOldImagePath] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (item) {
      setName(item.name)
      setPrice(item.price.toString())
      setCategoryId(item.categoryId)
      setTax(item.tax)
      setAvailable(item.available)
      setImagePreview(item.imageUrl || null)
      // Extract image path from Supabase Storage URL if it exists
      if (item.imageUrl) {
        try {
          const url = new URL(item.imageUrl)
          // Supabase Storage public URL format: /storage/v1/object/public/bucket-name/path
          // Bucket name is "Menu Images" (may be URL encoded as "Menu%20Images")
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/(?:Menu%20Images|Menu Images)\/(.+)$/)
          if (pathMatch) {
            setOldImagePath(pathMatch[1])
          } else {
            // Fallback: try to extract from pathname directly
            const fallbackMatch = url.pathname.match(/\/menu-items\/(.+)$/)
            if (fallbackMatch) {
              setOldImagePath(`menu-items/${fallbackMatch[1]}`)
            } else {
              setOldImagePath(null)
            }
          }
        } catch {
          // If URL parsing fails, it might be a data URL or external URL
          setOldImagePath(null)
        }
      } else {
        setOldImagePath(null)
      }
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [item, categories])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    // Mark old image for deletion if it exists
    if (item?.imageUrl && oldImagePath) {
      // Keep the old image path for deletion when saving
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) return

    setIsUploading(true)
    let imageUrl = item?.imageUrl || null
    let newImagePath: string | null = null

    try {
      // If a new file was uploaded, upload it to Supabase Storage
      if (imageFile) {
        const formData = new FormData()
        formData.append("image", imageFile)

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to upload image")
        }

        const data = await response.json()
        imageUrl = data.url
        newImagePath = data.path

        // Delete old image if updating and old image exists
        if (item && oldImagePath && oldImagePath !== newImagePath) {
          try {
            await fetch(`/api/upload/image?path=${encodeURIComponent(oldImagePath)}`, {
              method: "DELETE",
            })
          } catch (deleteError) {
            // Log but don't fail the operation if deletion fails
            console.error("Failed to delete old image:", deleteError)
          }
        }
      } else if (!imagePreview && item?.imageUrl && oldImagePath) {
        // Image was removed, delete the old image
        imageUrl = null
        try {
          await fetch(`/api/upload/image?path=${encodeURIComponent(oldImagePath)}`, {
            method: "DELETE",
          })
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError)
        }
      }

      onSave({
        ...(item || {}),
        name: name.trim(),
        price: Number.parseFloat(price),
        categoryId,
        tax,
        available,
        imageUrl,
      })
      
      // Only reset form if creating new item
      if (!item) {
        setName("")
        setPrice("")
        setCategoryId("")
        setTax(true)
        setAvailable(true)
        setImagePreview(null)
        setImageFile(null)
        setOldImagePath(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        // Update old image path if new image was uploaded
        if (newImagePath) {
          setOldImagePath(newImagePath)
        } else if (!imagePreview) {
          setOldImagePath(null)
        }
        setImageFile(null)
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
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

        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Food Image</label>
          <div className="space-y-2">
            {imagePreview ? (
              <div className="relative w-full h-48 sm:h-64 rounded-lg border border-border overflow-hidden bg-muted">
                <Image
                  src={imagePreview}
                  alt="Food preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 sm:h-64 rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
                  Click to upload food image
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max size: 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {!imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            )}
          </div>
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
          disabled={!name.trim() || !price || !categoryId || isUploading}
          className="bg-green-600 hover:bg-green-700 text-sm sm:text-base h-9 sm:h-10"
        >
          {isUploading ? "Uploading..." : item ? "Update" : "Add"} Item
        </Button>
        <Button 
          type="button" 
          onClick={onCancel} 
          variant="outline" 
          disabled={isUploading}
          className="text-sm sm:text-base h-9 sm:h-10"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
