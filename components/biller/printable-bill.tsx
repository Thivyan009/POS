"use client"

import Image from "next/image"

interface PrintableBillProps {
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
}

export default function PrintableBill({ bill, billId, createdAt }: PrintableBillProps) {
  const currentDate = createdAt ? new Date(createdAt) : new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="printable-receipt">
      <div className="thermal-receipt">
        {/* Restaurant Logo and Header */}
        <div className="receipt-header">
          <div className="logo-container">
            <Image
              src="/restaurant-logo.png"
              alt="Restaurant Logo"
              width={80}
              height={80}
              className="restaurant-logo"
              priority
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          <h1 className="restaurant-name">Paruthimunai Restaurant</h1>
        </div>

        {/* Bill Information */}
        <div className="receipt-info">
          {billId && (
            <div className="info-row">
              <span className="info-label">Bill #:</span>
              <span className="info-value">{billId.slice(0, 8)}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">{formattedDate}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Time:</span>
            <span className="info-value">{formattedTime}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="receipt-divider"></div>

        {/* Items List */}
        <div className="receipt-items">
          <div className="items-header">
            <span className="item-col-name">Item</span>
            <span className="item-col-qty">Qty</span>
            <span className="item-col-price">Total</span>
          </div>
          
          {bill.items.map((item) => {
            const itemTotal = item.price * item.quantity
            return (
              <div key={item.id} className="item-row">
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  {item.tax && (
                    <div className="item-tax">(Taxable)</div>
                  )}
                </div>
                <div className="item-qty">{item.quantity}</div>
                <div className="item-total">LKR {itemTotal.toFixed(2)}</div>
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="receipt-divider"></div>

        {/* Totals */}
        <div className="receipt-totals">
          <div className="total-row">
            <span className="total-label">Subtotal:</span>
            <span className="total-value">LKR {bill.subtotal.toFixed(2)}</span>
          </div>
          {bill.tax > 0 && (
            <div className="total-row">
              <span className="total-label">Tax (10%):</span>
              <span className="total-value">LKR {bill.tax.toFixed(2)}</span>
            </div>
          )}
          {bill.discount > 0 && (
            <div className="total-row discount-row">
              <span className="total-label">Discount:</span>
              <span className="total-value">-LKR {bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="total-row final-total">
            <span className="total-label">TOTAL:</span>
            <span className="total-value">LKR {bill.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <div className="footer-divider"></div>
          <p className="footer-text">Thank you, come again!</p>
          <p className="footer-text">Phone: +94 77 895 9431</p>
        </div>
      </div>
    </div>
  )
}

