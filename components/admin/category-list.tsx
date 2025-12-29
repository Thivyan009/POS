"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CategoryListProps {
  categories: any[]
  onEdit: (category: any) => void
  onDelete: (categoryId: string) => void
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">No categories yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Name</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium text-xs sm:text-sm">{category.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 sm:gap-2 justify-end">
                  <Button onClick={() => onEdit(category)} variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                    Edit
                  </Button>
                  <Button onClick={() => onDelete(category.id)} variant="destructive" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
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
