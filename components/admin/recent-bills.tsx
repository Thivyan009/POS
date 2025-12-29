"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { apiService } from "@/services/api-service"

export default function RecentBills() {
  const [bills, setBills] = useState([])

  useEffect(() => {
    const loadBills = async () => {
      const result = await apiService.getBills(1, 10)
      setBills(result.bills)
    }
    loadBills()
  }, [])

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Recent Bills</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {bills.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 sm:p-8 text-center">
            <p className="text-muted-foreground text-sm">No bills yet</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Bill ID</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Total</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill: any) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">{bill.id}</TableCell>
                    <TableCell className="text-right font-semibold text-xs sm:text-sm">
                      ${bill.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">{bill.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
