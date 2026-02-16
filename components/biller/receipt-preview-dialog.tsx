"use client"

import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import PrintableBill from "./printable-bill"
import { Printer, Download, X, Loader2 } from "lucide-react"

interface ReceiptPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill: {
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
      tax: boolean
    }>
    subtotal: number
    tax: number
    discount: number
    total: number
  }
  billId?: string
  createdAt?: string
  onPrint?: () => void | Promise<void>
  isPrinting?: boolean
}

export default function ReceiptPreviewDialog({
  open,
  onOpenChange,
  bill,
  billId,
  createdAt,
  onPrint,
  isPrinting = false,
}: ReceiptPreviewDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handlePrint = async () => {
    if (onPrint) {
      await onPrint()
      // Parent closes dialog after print and delay
    } else {
      window.print()
      onOpenChange(false)
    }
  }

  const handleSaveAsPDF = async () => {
    if (!receiptRef.current || typeof window === 'undefined') return

    setIsGeneratingPDF(true)
    try {
      // Dynamically import html2pdf only on client side
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = receiptRef.current
      
      // Calculate approximate height based on content
      // Base height: header (60mm) + info (20mm) + items (15mm each) + totals (40mm) + footer (30mm)
      const baseHeight = 60 + 20 + 40 + 30
      const itemsHeight = bill.items.length * 15
      const estimatedHeight = Math.max(200, baseHeight + itemsHeight)
      
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `receipt-${billId ? billId.slice(0, 8) : Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          width: 302, // 80mm at 96 DPI (thermal standard)
          windowWidth: 302,
        },
        jsPDF: { 
          unit: 'mm', 
          format: [80, estimatedHeight], // 80mm thermal width
          orientation: 'portrait',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback to print dialog if PDF generation fails
      alert("PDF generation failed. Opening print dialog instead.")
      window.print()
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogDescription>
            This is exactly how the receipt will print: 80mm width, variable height. What you see here is what you get.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 gap-4">
          {/* Preview Container - scrollable on small screens */}
          <div
            className="receipt-preview-container receipt-print-area flex-1 min-h-0 overflow-y-auto overscroll-contain"
            ref={receiptRef}
          >
            <PrintableBill bill={bill} billId={billId} createdAt={createdAt} />
          </div>

          {/* Action Buttons - always visible, adequate touch targets */}
          <div className="flex flex-wrap gap-3 justify-end pt-4 border-t flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPrinting}
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAsPDF}
              disabled={isGeneratingPDF || isPrinting}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700"
              disabled={isPrinting}
            >
              {isPrinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Printing...
                </>
              ) : (
                <>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p className="font-semibold mb-1">💡 Print format</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>80mm width</strong>, variable height (one continuous strip)</li>
              <li>Print output matches this preview exactly</li>
              <li>Save as PDF uses the same 80mm width</li>
              <li>In the print dialog, use 100% scale and avoid “Fit to page”</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

