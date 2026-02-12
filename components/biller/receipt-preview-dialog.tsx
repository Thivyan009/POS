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
  onPrint?: () => void
}

export default function ReceiptPreviewDialog({
  open,
  onOpenChange,
  bill,
  billId,
  createdAt,
  onPrint,
}: ReceiptPreviewDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
    onOpenChange(false)
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
          width: 288, // 3in at 96 DPI = 288px
          windowWidth: 288,
        },
        jsPDF: { 
          unit: 'mm', 
          format: [76.2, estimatedHeight], // 3 inches = 76.2mm width
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogDescription>
            Preview your receipt before printing. This is how it will look on 3-inch thermal paper.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Preview Container */}
          <div className="receipt-preview-container" ref={receiptRef}>
            <PrintableBill bill={bill} billId={billId} createdAt={createdAt} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAsPDF}
              disabled={isGeneratingPDF}
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
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p className="font-semibold mb-1">💡 Testing Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Click "Save as PDF" to download the receipt as a PDF file</li>
              <li>The PDF will be formatted for 3-inch thermal paper</li>
              <li>Click "Print Receipt" to print directly to your thermal printer</li>
              <li>When you have your printer, select "XP-E200L" in the print dialog</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

