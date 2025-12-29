"use client"

import { useState, useEffect } from "react"
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
import { Copy, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export default function DiscountCodeManagement() {
  const { toast } = useToast()
  const [codes, setCodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
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
        description: formData.description || `Save ${discountPercent}%`,
      })
      
      toast({
        title: "Success",
        description: `Discount code "${code}" created successfully`,
      })
      
      setFormData({ discountPercent: [10], description: "" })
      setShowForm(false)
      loadCodes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discount code",
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update discount code",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return

    try {
      await apiService.deleteDiscountCode(id)
      await loadCodes()
      toast({
        title: "Success",
        description: "Discount code deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount code",
        variant: "destructive",
      })
    }
  }

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
                    setFormData({ discountPercent: "", description: "" })
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
          <CardTitle className="text-base sm:text-lg">Active Discount Codes</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {codes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 sm:p-8 text-center">
              <p className="text-muted-foreground text-sm">No discount codes created yet</p>
              <p className="text-xs text-muted-foreground mt-2">
                Create your first discount code to get started
              </p>
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
                    <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code: any) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-medium text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span>{code.code}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(code.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm font-semibold">
                        {code.discountPercent}%
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
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(code.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

