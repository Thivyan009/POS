"use client"

import { useState, useCallback, useEffect } from "react"

interface BillItem {
  id: string
  name: string
  price: number
  quantity: number
  tax: boolean
}

interface Bill {
  items: BillItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
}

export function useBillerState() {
  const [bill, setBill] = useState<Bill>(() => {
    // Restore bill from localStorage if it exists
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos-current-bill")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return { items: [], subtotal: 0, tax: 0, discount: 0, total: 0 }
        }
      }
    }
    return { items: [], subtotal: 0, tax: 0, discount: 0, total: 0 }
  })

  // Save bill to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pos-current-bill", JSON.stringify(bill))
  }, [bill])

  const calculateTotals = useCallback((items: BillItem[], discount: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    // Prices already include tax. Do not add tax on top of item amounts.
    const taxAmount = 0
    const total = subtotal - discount

    return {
      subtotal,
      tax: taxAmount,
      discount,
      total: Math.max(0, total),
    }
  }, [])

  const addItem = useCallback(
    (item: any) => {
      setBill((prevBill) => {
        const existingItem = prevBill.items.find((i) => i.id === item.id)

        let newItems
        if (existingItem) {
          newItems = prevBill.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        } else {
          newItems = [...prevBill.items, { ...item, quantity: 1 }]
        }

        const { subtotal, tax, total } = calculateTotals(newItems, prevBill.discount)
        return { items: newItems, subtotal, tax, discount: prevBill.discount, total }
      })
    },
    [calculateTotals],
  )

  const removeItem = useCallback(
    (itemId: string) => {
      setBill((prevBill) => {
        const newItems = prevBill.items.filter((i) => i.id !== itemId)
        const { subtotal, tax, total } = calculateTotals(newItems, prevBill.discount)
        return { items: newItems, subtotal, tax, discount: prevBill.discount, total }
      })
    },
    [calculateTotals],
  )

  const updateQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItem(itemId)
        return
      }

      setBill((prevBill) => {
        const newItems = prevBill.items.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
        const { subtotal, tax, total } = calculateTotals(newItems, prevBill.discount)
        return { items: newItems, subtotal, tax, discount: prevBill.discount, total }
      })
    },
    [removeItem, calculateTotals],
  )

  const applyDiscount = useCallback(
    (amount: number) => {
      setBill((prevBill) => {
        const { subtotal, tax, total } = calculateTotals(prevBill.items, amount)
        return { ...prevBill, subtotal, tax, discount: amount, total }
      })
    },
    [calculateTotals],
  )

  const clearBill = useCallback(() => {
    setBill({ items: [], subtotal: 0, tax: 0, discount: 0, total: 0 })
    localStorage.removeItem("pos-current-bill")
  }, [])

  return { bill, addItem, removeItem, updateQuantity, applyDiscount, clearBill }
}
