"use client"

import { useState, useEffect, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Copy, Trash2, CheckCircle2, XCircle, Edit2, Search, Filter, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface DiscountCode {
  id: string
  code: string
  discountPercent: number
  description?: string | null
  active: boolean
  createdAt: string
}

export default function DiscountCodeManagement() {
  const { toast } = useToast()
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [formData, setFormData] = useState({
    discountPercent: [10] as number[],
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    discountPercent: [10] as number[],
    description: "",
  })

  useEffect(() => {
    loadCodes()
  }, [])

  const loadCodes = async () => {
    try {
      const data = await apiService.getDiscountCodes()
      setCodes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load discount codes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateCode = (percent: number): string => {
    // Generate a copy-friendly coupon code
    const prefix = "SAVE"
    const percentStr = percent.toString().padStart(2, "0")
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}${percentStr}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const discountPercent = formData.discountPercent[0]
    
    if (!discountPercent || discountPercent <= 0 || discountPercent > 100) {
      toast({
        title: "Invalid discount",
        description: "Please select a valid discount percentage (1-100)",
        variant: "destructive",
      })
      return
    }

    try {
      const code = generateCode(discountPercent)
      await apiService.createDiscountCode({
        code,
        discountPercent,
        description: formData.description.trim() || `Save ${discountPercent}%`,
      })
      
      toast({
        title: "Success",
        description: `Discount code "${code}" created successfully`,
      })
      
      setFormData({ discountPercent: [10], description: "" })
      setShowForm(false)
      loadCodes()
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create discount code"
      toast({
        title: "Error",
        description: errorMessage.includes("unique") 
          ? "A discount code with this pattern already exists. Please try again."
          : errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code)
    setEditFormData({
      discountPercent: [code.discountPercent],
      description: code.description || "",
    })
  }

  const handleUpdate = async () => {
    if (!editingCode) return

    const discountPercent = editFormData.discountPercent[0]
    
    if (!discountPercent || discountPercent <= 0 || discountPercent > 100) {
      toast({
        title: "Invalid discount",
        description: "Please select a valid discount percentage (1-100)",
        variant: "destructive",
      })
      return
    }

    try {
      await apiService.updateDiscountCode(editingCode.id, {
        discountPercent,
        description: editFormData.description.trim() || null,
      })
      
      toast({
        title: "Success",
        description: `Discount code "${editingCode.code}" updated successfully`,
      })
      
      setEditingCode(null)
      setEditFormData({ discountPercent: [10], description: "" })
      loadCodes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update discount code",
        variant: "destructive",
      })
    }
  }

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copied!",
        description: `Code "${code}" copied to clipboard`,
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await apiService.updateDiscountCode(id, { active: !currentActive })
      await loadCodes()
      toast({
        title: "Success",
        description: `Discount code ${currentActive ? "deactivated" : "activated"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update discount code",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete discount code "${code}"? This action cannot be undone.`)) return

    try {
      await apiService.deleteDiscountCode(id)
      await loadCodes()
      toast({
        title: "Success",
        description: "Discount code deleted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete discount code",
        variant: "destructive",
      })
    }
  }

  // Filter and search codes
  const filteredCodes = useMemo(() => {
    let filtered = codes

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((code) => 
        statusFilter === "active" ? code.active : !code.active
      )
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((code) =>
        code.code.toLowerCase().includes(query) ||
        code.description?.toLowerCase().includes(query) ||
        code.discountPercent.toString().includes(query)
      )
    }

    return filtered
  }, [codes, statusFilter, searchQuery])

  const activeCount = codes.filter((c) => c.active).length
  const inactiveCount = codes.filter((c) => !c.active).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="mt-4 text-muted-foreground">Loading discount codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Discount Codes</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {showForm ? "Cancel" : "+ Create Discount Code"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Create New Discount Code</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="discountPercent">Discount Percentage</Label>
                  <span className="text-lg font-bold text-primary">
                    {formData.discountPercent[0]}%
                  </span>
                </div>
                <Slider
                  id="discountPercent"
                  min={1}
                  max={100}
                  step={1}
                  value={formData.discountPercent}
                  onValueChange={(value) =>
                    setFormData({ ...formData, discountPercent: value })
                  }
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Slide to select a percentage between 1% and 100%
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g., Summer Sale 2024"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Generate Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ discountPercent: [10], description: "" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg">Discount Codes</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {codes.length} total • {activeCount} active • {inactiveCount} inactive
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-8"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-32">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {codes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 sm:p-8 text-center">
              <p className="text-muted-foreground text-sm">No discount codes created yet</p>
              <p className="text-xs text-muted-foreground mt-2">
                Create your first discount code to get started
              </p>
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 sm:p-8 text-center">
              <p className="text-muted-foreground text-sm">No discount codes match your search</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Code</TableHead>
                    <TableHead className="text-xs sm:text-sm">Discount</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Description</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-medium text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span>{code.code}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(code.code)}
                            title="Copy code"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm font-semibold">
                        <Badge variant="secondary">{code.discountPercent}%</Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                        {code.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={code.active}
                            onCheckedChange={() => handleToggleActive(code.id, code.active)}
                          />
                          {code.active ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(code)}
                            title="Edit code"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(code.id, code.code)}
                            title="Delete code"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCode} onOpenChange={(open) => !open && setEditingCode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Discount Code</DialogTitle>
            <DialogDescription>
              Update the discount percentage and description for "{editingCode?.code}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="editDiscountPercent">Discount Percentage</Label>
                <span className="text-lg font-bold text-primary">
                  {editFormData.discountPercent[0]}%
                </span>
              </div>
              <Slider
                id="editDiscountPercent"
                min={1}
                max={100}
                step={1}
                value={editFormData.discountPercent}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, discountPercent: value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description (Optional)</Label>
              <Input
                id="editDescription"
                type="text"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, description: e.target.value })
                }
                placeholder="e.g., Summer Sale 2024"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingCode(null)
                setEditFormData({ discountPercent: [10], description: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

