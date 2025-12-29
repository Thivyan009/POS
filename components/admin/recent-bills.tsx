"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useEffect, useState } from "react"
import { apiService } from "@/services/api-service"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import type { Bill } from "@/lib/types"
import BillDetailsDialog from "./bill-details-dialog"
import { Receipt } from "lucide-react"

interface RecentBillsProps {
  dateRange?: { from?: Date; to?: Date }
}

const BILLS_PER_PAGE = 20

export default function RecentBills({ dateRange }: RecentBillsProps) {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalBills, setTotalBills] = useState(0)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when date range changes
  }, [dateRange])

  useEffect(() => {
    const loadBills = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await apiService.getBills(
          currentPage,
          BILLS_PER_PAGE,
          dateRange?.from,
          dateRange?.to
        )
        setBills(result.bills as Bill[])
        setTotalBills(result.total || 0)
      } catch (error) {
        console.error("Error loading bills:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to load bills"
        setError(errorMessage)
        setBills([])
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadBills()
  }, [dateRange, currentPage, toast])

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill)
    setIsDialogOpen(true)
  }

  const totalPages = Math.ceil(totalBills / BILLS_PER_PAGE)

  const statusColors = {
    completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  }

  return (
    <>
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">Bill History</CardTitle>
            {!isLoading && !error && (
              <span className="text-sm text-muted-foreground">
                {totalBills} {totalBills === 1 ? "bill" : "bills"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Spinner className="mx-auto h-6 w-6" />
                <p className="mt-2 text-sm text-muted-foreground">Loading bills...</p>
              </div>
            </div>
          ) : error ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Receipt className="h-8 w-8" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Error loading bills</EmptyTitle>
                <EmptyDescription>{error}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : bills.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Receipt className="h-8 w-8" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No bills found</EmptyTitle>
                <EmptyDescription>
                  {dateRange?.from || dateRange?.to
                    ? "No bills found for the selected date range"
                    : "No bills have been created yet"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Bill ID</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Items</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden md:table-cell">Subtotal</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden lg:table-cell">Tax</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden lg:table-cell">Discount</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm font-semibold">Total</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow
                        key={bill.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleBillClick(bill)}
                      >
                        <TableCell className="font-medium text-xs sm:text-sm font-mono">
                          {bill.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${statusColors[bill.status] || ""}`}
                          >
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {bill.items.length}
                        </TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden md:table-cell">
                          LKR {bill.subtotal.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden lg:table-cell">
                          LKR {bill.tax.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden lg:table-cell">
                          {bill.discount > 0 ? (
                            <span className="text-green-600 dark:text-green-400">
                              -LKR {bill.discount.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-xs sm:text-sm">
                          LKR {bill.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                          {format(new Date(bill.created_at), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        }}
                        className={
                          currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {(() => {
                      const pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (page === 1 || page === totalPages) return true
                          if (Math.abs(page - currentPage) <= 1) return true
                          return false
                        })
                      
                      return pagesToShow.map((page, index) => {
                        const showEllipsisBefore = index > 0 && page - pagesToShow[index - 1] > 1
                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && (
                              <PaginationItem>
                                <span className="px-2">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(page)
                                  window.scrollTo({ top: 0, behavior: "smooth" })
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        )
                      })
                    })()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <BillDetailsDialog
        bill={selectedBill}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
