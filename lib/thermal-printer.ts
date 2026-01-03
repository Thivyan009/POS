/**
 * Thermal Printer Utility for XP-E200L 80mm Thermal Receipt Printer
 * Supports both browser print dialog and direct ESC/POS printing via WebUSB
 */

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

export const ThermalPrinter = {
  // ESC/POS Commands
  commands: {
    // Initialize printer
    INIT: ESC + '@',
    
    // Text formatting
    BOLD_ON: ESC + 'E' + '\x01',
    BOLD_OFF: ESC + 'E' + '\x00',
    UNDERLINE_ON: ESC + '-' + '\x01',
    UNDERLINE_OFF: ESC + '-' + '\x00',
    
    // Alignment
    ALIGN_LEFT: ESC + 'a' + '\x00',
    ALIGN_CENTER: ESC + 'a' + '\x01',
    ALIGN_RIGHT: ESC + 'a' + '\x02',
    
    // Font size
    FONT_NORMAL: ESC + '!' + '\x00',
    FONT_LARGE: ESC + '!' + '\x10',
    FONT_EXTRA_LARGE: ESC + '!' + '\x30',
    
    // Line feed
    LINE_FEED: '\n',
    DOUBLE_LINE_FEED: '\n\n',
    
    // Cut paper
    CUT_PAPER: GS + 'V' + '\x41' + '\x03',
    
    // Open cash drawer (if connected)
    OPEN_CASH_DRAWER: ESC + 'p' + '\x00' + '\x19' + '\xFF',
  },

  /**
   * Format text for thermal printer (80mm width = ~48 characters)
   */
  formatReceipt(bill: {
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
  }, billId?: string, createdAt?: string): string {
    const date = createdAt ? new Date(createdAt) : new Date()
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    let receipt = ''
    
    // Initialize printer
    receipt += this.commands.INIT
    
    // Header with logo placeholder
    receipt += this.commands.ALIGN_CENTER
    receipt += this.commands.FONT_LARGE
    receipt += this.commands.BOLD_ON
    receipt += 'Paruthimunai Restaurant\n'
    receipt += this.commands.BOLD_OFF
    receipt += this.commands.FONT_NORMAL
    receipt += this.commands.LINE_FEED
    
    // Bill info
    receipt += this.commands.ALIGN_LEFT
    if (billId) {
      receipt += `Bill #: ${billId.slice(0, 8)}\n`
    }
    receipt += `Date: ${formattedDate}\n`
    receipt += `Time: ${formattedTime}\n`
    receipt += this.commands.DOUBLE_LINE_FEED
    
    // Items
    receipt += '--------------------------------\n'
    receipt += this.commands.BOLD_ON
    receipt += 'Item'.padEnd(20) + 'Qty'.padStart(4) + 'Price'.padStart(12) + '\n'
    receipt += this.commands.BOLD_OFF
    receipt += '--------------------------------\n'
    
    bill.items.forEach((item) => {
      const itemName = item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name
      const qty = item.quantity.toString()
      const price = `LKR ${(item.price * item.quantity).toFixed(2)}`
      receipt += itemName.padEnd(20) + qty.padStart(4) + price.padStart(12) + '\n'
      if (item.tax) {
        receipt += '  (Taxable)'.padEnd(36) + '\n'
      }
    })
    
    receipt += '--------------------------------\n'
    receipt += this.commands.DOUBLE_LINE_FEED
    
    // Totals
    receipt += this.commands.ALIGN_RIGHT
    receipt += `Subtotal: LKR ${bill.subtotal.toFixed(2)}\n`
    if (bill.tax > 0) {
      receipt += `Tax (10%): LKR ${bill.tax.toFixed(2)}\n`
    }
    if (bill.discount > 0) {
      receipt += `Discount: -LKR ${bill.discount.toFixed(2)}\n`
    }
    receipt += this.commands.BOLD_ON
    receipt += this.commands.FONT_LARGE
    receipt += `TOTAL: LKR ${bill.total.toFixed(2)}\n`
    receipt += this.commands.FONT_NORMAL
    receipt += this.commands.BOLD_OFF
    receipt += this.commands.DOUBLE_LINE_FEED
    
    // Footer
    receipt += this.commands.ALIGN_CENTER
    receipt += this.commands.DOUBLE_LINE_FEED
    receipt += 'Thank you, come again!\n'
    receipt += this.commands.DOUBLE_LINE_FEED
    receipt += this.commands.DOUBLE_LINE_FEED
    
    // Cut paper
    receipt += this.commands.CUT_PAPER
    
    return receipt
  },

  /**
   * Print via WebUSB (if supported and printer is connected)
   */
  async printViaWebUSB(receiptText: string): Promise<boolean> {
    try {
      if (!navigator.usb) {
        return false
      }

      // Request access to USB device
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x0483 }, // STMicroelectronics (common for thermal printers)
          { vendorId: 0x04e8 }, // Samsung (some thermal printers)
        ],
      })

      await device.open()
      
      // Find the interface with bulk transfer
      const interfaceNumber = device.configuration.interfaces.find(
        (iface) => iface.alternate.endpoints.some((ep) => ep.direction === 'out')
      )?.interfaceNumber

      if (interfaceNumber === undefined) {
        await device.close()
        return false
      }

      await device.claimInterface(interfaceNumber)
      
      // Convert text to Uint8Array
      const encoder = new TextEncoder()
      const data = encoder.encode(receiptText)
      
      // Send data to printer
      await device.transferOut(
        device.configuration.interfaces[interfaceNumber].alternate.endpoints.find(
          (ep) => ep.direction === 'out'
        )!.endpointNumber,
        data
      )

      await device.releaseInterface(interfaceNumber)
      await device.close()
      
      return true
    } catch (error) {
      console.error('WebUSB print error:', error)
      return false
    }
  },

  /**
   * Print via browser print dialog (fallback method)
   */
  printViaBrowser(): void {
    window.print()
  },
}

