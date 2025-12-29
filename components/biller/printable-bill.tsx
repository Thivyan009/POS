"use client"

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
    month: "long",
    day: "numeric",
  })
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="printable-receipt">
      <div className="max-w-xs mx-auto p-4 bg-white text-black">
        {/* Restaurant Logo and Header */}
        <div className="text-center mb-4 border-b-2 border-gray-400 pb-3">
          <div className="flex justify-center mb-2">
            <img
              src="/restaurant-logo.png"
              alt="Restaurant Logo"
              className="h-16 w-16 object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <h1 className="text-xl font-bold mb-1 uppercase tracking-wide">Restaurant POS</h1>
          <p className="text-xs text-gray-600">Thank you for your visit!</p>
        </div>

        {/* Bill Information */}
        <div className="mb-4 space-y-1 text-sm">
          {billId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Bill #:</span>
              <span className="font-mono font-semibold">{billId.slice(0, 8)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400 my-4"></div>

        {/* Items List */}
        <div className="mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="text-left py-1.5 font-bold">Item</th>
                <th className="text-center py-1.5 font-bold w-12">Qty</th>
                <th className="text-right py-1.5 font-bold">Price</th>
                <th className="text-right py-1.5 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item) => {
                const itemTotal = item.price * item.quantity
                return (
                  <tr key={item.id} className="border-b border-dashed border-gray-300">
                    <td className="py-2">
                      <div className="font-medium">{item.name}</div>
                      {item.tax && (
                        <div className="text-xs text-gray-500">(Taxable)</div>
                      )}
                    </td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">LKR {item.price.toFixed(2)}</td>
                    <td className="text-right py-2 font-semibold">LKR {itemTotal.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400 my-4"></div>

        {/* Totals */}
        <div className="space-y-1.5 mb-4 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-semibold">LKR {bill.subtotal.toFixed(2)}</span>
          </div>
          {bill.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Tax (10%):</span>
              <span className="font-semibold">LKR {bill.tax.toFixed(2)}</span>
            </div>
          )}
          {bill.discount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span className="font-semibold">-LKR {bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-400 pt-2 mt-2">
            <div className="flex justify-between text-base font-bold uppercase tracking-wide">
              <span>Total:</span>
              <span>LKR {bill.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-4 mt-4 text-center text-xs text-gray-600">
          <p className="mb-1">Thank you for your business!</p>
          <p>Visit us again soon</p>
        </div>
      </div>
    </div>
  )
}

