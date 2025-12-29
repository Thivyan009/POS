"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ItemListProps {
  items: any[]
  categories: any[]
  onEdit: (item: any) => void
  onDelete: (itemId: string) => void
}

export default function ItemList({ items, categories, onEdit, onDelete }: ItemListProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">No items yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Item</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Category</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Price</TableHead>
            <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">Tax</TableHead>
            <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">Available</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  {item.imageUrl && (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={item.imageUrl.startsWith("data:")}
                      />
                    </div>
                  )}
                  <div>
                    <div>{item.name}</div>
                    <div className="text-muted-foreground text-[10px] sm:hidden mt-0.5">{getCategoryName(item.categoryId)}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                {getCategoryName(item.categoryId)}
              </TableCell>
              <TableCell className="text-right font-semibold text-xs sm:text-sm">
                LKR {item.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <Badge variant={item.tax ? "default" : "outline"} className="text-[10px]">
                  {item.tax ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <Badge variant={item.available ? "default" : "secondary"} className="text-[10px]">
                  {item.available ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 sm:gap-2 justify-end">
                  <Button onClick={() => onEdit(item)} variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                    Edit
                  </Button>
                  <Button onClick={() => onDelete(item.id)} variant="destructive" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
