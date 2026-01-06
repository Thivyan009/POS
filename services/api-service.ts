// API Service Layer - Uses Supabase for all backend calls
import { supabase } from "@/lib/supabase"
import type { MenuCategoryRow, MenuItemRow, BillRow, BillItemRow, UserRow, DiscountCodeRow } from "@/lib/types"

// Helper function to convert snake_case to camelCase for menu categories
const transformCategory = (row: MenuCategoryRow) => ({
  id: row.id,
  name: row.name,
})

// Helper function to convert snake_case to camelCase for menu items
const transformMenuItem = (row: MenuItemRow) => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  categoryId: row.category_id,
  tax: row.tax,
  available: row.available,
  imageUrl: row.image_url || null,
})

// Helper function to transform bill items
const transformBillItem = (row: BillItemRow) => ({
  id: row.id,
  name: row.item_name,
  price: Number(row.price),
  quantity: row.quantity,
  tax: row.tax,
})

export const apiService = {
  // Menu APIs
  getMenuCategories: async () => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("name", { ascending: true })

      if (error) throw error
      return (data || []).map(transformCategory)
    } catch (error) {
      console.error("Error fetching menu categories:", error)
      throw error
    }
  },

  getMenuItems: async (categoryId?: string) => {
    try {
      let query = supabase.from("menu_items").select("*").order("name", { ascending: true })

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []).map(transformMenuItem)
    } catch (error) {
      console.error("Error fetching menu items:", error)
      throw error
    }
  },

  // Menu Management APIs
  createMenuCategory: async (categoryData: { name: string }) => {
    try {
      const response = await fetch("/api/menu-categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to create menu category"
        console.error("Error creating menu category:", errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return { id: data.id, name: data.name }
    } catch (error: any) {
      console.error("Error creating menu category:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to create menu category")
    }
  },

  updateMenuCategory: async (id: string, categoryData: { name: string }) => {
    try {
      const response = await fetch("/api/menu-categories/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...categoryData }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to update menu category"
        console.error("Error updating menu category:", errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return { id: data.id, name: data.name }
    } catch (error: any) {
      console.error("Error updating menu category:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to update menu category")
    }
  },

  deleteMenuCategory: async (id: string) => {
    try {
      const response = await fetch(`/api/menu-categories/delete?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to delete menu category"
        console.error("Error deleting menu category:", errorMessage)
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error deleting menu category:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to delete menu category")
    }
  },

  createMenuItem: async (itemData: {
    name: string
    price: number
    categoryId: string
    tax: boolean
    available: boolean
    imageUrl?: string | null
  }) => {
    try {
      const response = await fetch("/api/menu-items/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to create menu item"
        console.error("Error creating menu item:", errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        tax: data.tax,
        available: data.available,
        imageUrl: data.imageUrl || null,
      }
    } catch (error: any) {
      console.error("Error creating menu item:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to create menu item")
    }
  },

  updateMenuItem: async (
    id: string,
    itemData: {
      name?: string
      price?: number
      categoryId?: string
      tax?: boolean
      available?: boolean
      imageUrl?: string | null
    },
  ) => {
    try {
      const response = await fetch("/api/menu-items/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...itemData }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to update menu item"
        console.error("Error updating menu item:", errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        tax: data.tax,
        available: data.available,
        imageUrl: data.imageUrl || null,
      }
    } catch (error: any) {
      console.error("Error updating menu item:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to update menu item")
    }
  },

  deleteMenuItem: async (id: string) => {
    try {
      const response = await fetch(`/api/menu-items/delete?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to delete menu item"
        console.error("Error deleting menu item:", errorMessage)
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error deleting menu item:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to delete menu item")
    }
  },

  // Bill APIs
  createBill: async (billData: {
    items: Array<{ id: string; name: string; price: number; quantity: number; tax: boolean }>
    subtotal: number
    tax: number
    discount: number
    total: number
    customerId?: string | null
    createdBy?: string | null
  }) => {
    try {
      // First, create the bill
      const { data: bill, error: billError } = await supabase
        .from("bills")
        .insert([
          {
            subtotal: billData.subtotal,
            tax: billData.tax,
            discount: billData.discount,
            total: billData.total,
            customer_id: billData.customerId || null,
            created_by: billData.createdBy || null,
            status: "completed",
          },
        ])
        .select()
        .single()

      if (billError) {
        // Enhanced error logging for bill creation
        const errorDetails: any = {
          message: billError.message,
          details: billError.details,
          hint: billError.hint,
          code: billError.code,
          status: (billError as any).status,
          statusText: (billError as any).statusText,
        }
        
        try {
          errorDetails.errorString = String(billError)
          errorDetails.errorJSON = JSON.stringify(billError, (key, value) => {
            if (value instanceof Error) {
              return {
                name: value.name,
                message: value.message,
                stack: value.stack,
              }
            }
            return value
          })
        } catch (e) {
          errorDetails.serializeError = String(e)
        }
        
        console.error("Supabase error creating bill:", errorDetails)
        
        // Provide user-friendly error messages
        if (billError.code === "42P01") {
          throw new Error("Bills table not found. Please run the database migration.")
        } else if (billError.code === "42703") {
          throw new Error("Database schema mismatch. The customer_id column may not exist. Please run migration: 004_create_customers_table.sql")
        } else if (billError.code === "42501") {
          throw new Error("Permission denied. Please check Row Level Security policies for the bills table.")
        } else if (billError.message) {
          throw new Error(billError.message)
        } else {
          throw new Error(billError.details || billError.hint || "Failed to create bill. Error code: " + (billError.code || "unknown"))
        }
      }

      if (!bill) {
        throw new Error("No bill data returned from database")
      }

      // Then, create bill items
      const billItems = billData.items.map((item) => ({
        bill_id: bill.id,
        menu_item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        tax: item.tax,
      }))

      const { error: itemsError } = await supabase.from("bill_items").insert(billItems)

      if (itemsError) {
        console.error("Supabase error creating bill items:", {
          message: itemsError.message,
          details: itemsError.details,
          hint: itemsError.hint,
          code: itemsError.code,
        })
        
        if (itemsError.code === "42501") {
          throw new Error("Permission denied. Please check Row Level Security policies for the bill_items table.")
        } else if (itemsError.message) {
          throw new Error("Failed to create bill items: " + itemsError.message)
        } else {
          throw new Error("Failed to create bill items. Error code: " + (itemsError.code || "unknown"))
        }
      }

      return {
        id: bill.id,
        ...billData,
        status: "completed",
        createdAt: bill.created_at,
      }
    } catch (error: any) {
      // Enhanced error logging
      const errorLog: any = {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
      }
      
      try {
        errorLog.errorString = String(error)
        errorLog.errorJSON = JSON.stringify(error, (key, value) => {
          if (value instanceof Error) {
            return {
              name: value.name,
              message: value.message,
              stack: value.stack,
            }
          }
          return value
        })
      } catch (e) {
        errorLog.serializeError = String(e)
      }
      
      console.error("Error creating bill - Full details:", errorLog)
      
      // Re-throw if it's already a user-friendly error
      if (error instanceof Error && error.message) {
        throw error
      }
      
      throw new Error(error?.message || error?.details || error?.hint || "Failed to create bill. Please check the console for details.")
    }
  },

  getBills: async (page = 1, limit = 20, fromDate?: Date, toDate?: Date, billerId?: string) => {
    try {
      let query = supabase
        .from("bills")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (fromDate) {
        query = query.gte("created_at", fromDate.toISOString())
      }
      if (toDate) {
        // Add one day to include the entire end date
        const endDate = new Date(toDate)
        endDate.setHours(23, 59, 59, 999)
        query = query.lte("created_at", endDate.toISOString())
      }
      if (billerId) {
        query = query.eq("created_by", billerId)
      }

      const { data, error, count } = await query

      if (error) throw error

      // Preload biller (user) emails for created_by
      const billerIds = Array.from(
        new Set((data || []).map((bill) => bill.created_by).filter((id): id is string => Boolean(id))),
      )

      let billerEmailMap: Record<string, string> = {}
      if (billerIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id, email")
          .in("id", billerIds)

        if (usersError) {
          console.error("Error fetching biller emails:", usersError)
        } else {
          billerEmailMap = (users || []).reduce((acc: Record<string, string>, user) => {
            acc[user.id] = user.email
            return acc
          }, {})
        }
      }

      // Fetch bill items for each bill
      const billsWithItems = await Promise.all(
        (data || []).map(async (bill) => {
          const { data: items } = await supabase
            .from("bill_items")
            .select("*")
            .eq("bill_id", bill.id)

          return {
            id: bill.id,
            subtotal: Number(bill.subtotal),
            tax: Number(bill.tax),
            discount: Number(bill.discount),
            total: Number(bill.total),
            status: bill.status,
            customer_id: bill.customer_id,
            created_by: bill.created_by,
            created_by_email: bill.created_by ? billerEmailMap[bill.created_by] || null : null,
            created_at: bill.created_at,
            createdAt: bill.created_at, // Keep for backwards compatibility
            items: (items || []).map(transformBillItem),
          }
        }),
      )

      return {
        bills: billsWithItems,
        total: count || 0,
        page,
        limit,
      }
    } catch (error) {
      console.error("Error fetching bills:", error)
      throw error
    }
  },

  // Analytics APIs
  getRevenue: async (fromDate?: Date, toDate?: Date) => {
    try {
      let query = supabase.from("bills").select("total, created_at")

      if (fromDate) {
        query = query.gte("created_at", fromDate.toISOString())
      }
      if (toDate) {
        const endDate = new Date(toDate)
        endDate.setHours(23, 59, 59, 999)
        query = query.lte("created_at", endDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      const bills = data || []
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const todayTotal = bills
        .filter((bill) => new Date(bill.created_at) >= today)
        .reduce((sum, bill) => sum + Number(bill.total), 0)

      const thisWeekTotal = bills
        .filter((bill) => new Date(bill.created_at) >= weekAgo)
        .reduce((sum, bill) => sum + Number(bill.total), 0)

      const thisMonthTotal = bills
        .filter((bill) => new Date(bill.created_at) >= monthAgo)
        .reduce((sum, bill) => sum + Number(bill.total), 0)

      return {
        today: todayTotal,
        thisWeek: thisWeekTotal,
        thisMonth: thisMonthTotal,
      }
    } catch (error) {
      console.error("Error fetching revenue:", error)
      throw error
    }
  },

  getSalesByHour: async (fromDate?: Date, toDate?: Date) => {
    try {
      let query = supabase.from("bills").select("total, created_at")

      if (fromDate) {
        query = query.gte("created_at", fromDate.toISOString())
      }
      if (toDate) {
        const endDate = new Date(toDate)
        endDate.setHours(23, 59, 59, 999)
        query = query.lte("created_at", endDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      const bills = data || []
      const salesByHour: Record<string, number> = {}

      bills.forEach((bill) => {
        const date = new Date(bill.created_at)
        const hour = `${String(date.getHours()).padStart(2, "0")}:00`
        salesByHour[hour] = (salesByHour[hour] || 0) + Number(bill.total)
      })

      // Ensure full 24-hour coverage so the chart always renders consistently
      const result: Array<{ hour: string; sales: number }> = []
      for (let i = 0; i < 24; i++) {
        const hourLabel = `${String(i).padStart(2, "0")}:00`
        result.push({ hour: hourLabel, sales: salesByHour[hourLabel] || 0 })
      }

      return result
    } catch (error) {
      console.error("Error fetching sales by hour:", error)
      throw error
    }
  },

  // Biller-specific analytics
  getBillerDailyStats: async (billerId: string, date?: Date) => {
    try {
      const targetDate = date || new Date()
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
      const endOfDay = new Date(startOfDay)
      endOfDay.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from("bills")
        .select("id, subtotal, tax, discount, total, created_at")
        .eq("created_by", billerId)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())
        .order("created_at", { ascending: false })

      if (error) throw error

      const bills = data || []

      const totals = bills.reduce(
        (acc, bill) => {
          acc.grossSales += Number(bill.subtotal)
          acc.taxCollected += Number(bill.tax)
          acc.discountGiven += Number(bill.discount)
          acc.netSales += Number(bill.total)
          return acc
        },
        { grossSales: 0, taxCollected: 0, discountGiven: 0, netSales: 0 },
      )

      const stats = {
        date: startOfDay.toISOString(),
        totalSales: totals.netSales,
        grossSales: totals.grossSales,
        taxCollected: totals.taxCollected,
        discountGiven: totals.discountGiven,
        billsCount: bills.length,
        averageBill: bills.length ? totals.netSales / bills.length : 0,
        bills: bills.map((bill) => ({
          id: bill.id,
          subtotal: Number(bill.subtotal),
          tax: Number(bill.tax),
          discount: Number(bill.discount),
          total: Number(bill.total),
          createdAt: bill.created_at,
        })),
      }

      return stats
    } catch (error) {
      console.error("Error fetching biller daily stats:", error)
      throw error
    }
  },

  getTopItems: async (fromDate?: Date, toDate?: Date) => {
    try {
      // First, get bills in the date range
      let billQuery = supabase.from("bills").select("id, created_at")

      if (fromDate) {
        billQuery = billQuery.gte("created_at", fromDate.toISOString())
      }
      if (toDate) {
        const endDate = new Date(toDate)
        endDate.setHours(23, 59, 59, 999)
        billQuery = billQuery.lte("created_at", endDate.toISOString())
      }

      const { data: bills, error: billsError } = await billQuery

      if (billsError) throw billsError

      if (!bills || bills.length === 0) {
        return []
      }

      const billIds = bills.map((b) => b.id)

      // Get bill items for these bills
      const { data: billItems, error: itemsError } = await supabase
        .from("bill_items")
        .select("item_name, quantity")
        .in("bill_id", billIds)

      if (itemsError) throw itemsError

      // Aggregate by item name
      const itemCounts: Record<string, number> = {}
      ;(billItems || []).forEach((item) => {
        itemCounts[item.item_name] = (itemCounts[item.item_name] || 0) + item.quantity
      })

      // Convert to array and sort by count
      return Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10
    } catch (error) {
      console.error("Error fetching top items:", error)
      throw error
    }
  },

  // User APIs
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, enabled, role, created_at")
        .order("role", { ascending: true })
        .order("email", { ascending: true })

      if (error) throw error
      return (data || []).map((user) => ({
        id: user.id,
        email: user.email,
        enabled: user.enabled,
        role: user.role,
        created_at: user.created_at,
      }))
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  getBillers: async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, enabled, role")
        .eq("role", "biller")
        .order("email", { ascending: true })

      if (error) throw error
      return (data || []).map((user) => ({
        id: user.id,
        email: user.email,
        enabled: user.enabled,
        role: user.role,
      }))
    } catch (error) {
      console.error("Error fetching billers:", error)
      throw error
    }
  },

  createUser: async (userData: { email: string; password: string; role: "admin" | "biller" }) => {
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create user")
      }

      const user = await response.json()
      return {
        id: user.id,
        email: user.email,
        enabled: user.enabled,
        role: user.role,
        created_at: user.created_at,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  updateBiller: async (id: string, data: { enabled?: boolean; email?: string }) => {
    try {
      const updateData: any = {}
      if (data.enabled !== undefined) updateData.enabled = data.enabled
      if (data.email !== undefined) updateData.email = data.email

      const { data: updated, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return {
        id: updated.id,
        email: updated.email,
        enabled: updated.enabled,
        role: updated.role,
      }
    } catch (error) {
      console.error("Error updating biller:", error)
      throw error
    }
  },

  updateUser: async (id: string, data: { enabled?: boolean; email?: string }) => {
    try {
      // Default admin email that cannot be disabled
      const DEFAULT_ADMIN_EMAIL = "paruthimunaitech@gmail.com"

      // If trying to disable, check if it's the default admin
      if (data.enabled === false) {
        const { data: user } = await supabase
          .from("users")
          .select("email")
          .eq("id", id)
          .single()

        if (user && user.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
          throw new Error("The default admin account cannot be disabled")
        }
      }

      const updateData: any = {}
      if (data.enabled !== undefined) updateData.enabled = data.enabled
      if (data.email !== undefined) updateData.email = data.email

      const { data: updated, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return {
        id: updated.id,
        email: updated.email,
        enabled: updated.enabled,
        role: updated.role,
      }
    } catch (error: any) {
      console.error("Error updating user:", error)
      throw error
    }
  },

  // Discount Code APIs
  getDiscountCodes: async () => {
    try {
      const response = await fetch("/api/discount-codes/list")
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || "Failed to fetch discount codes")
      }
      return await response.json()
    } catch (error: any) {
      console.error("Error fetching discount codes:", error)
      throw error
    }
  },

  createDiscountCode: async (codeData: { code: string; discountPercent: number; description?: string }) => {
    try {
      const response = await fetch("/api/discount-codes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(codeData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to create discount code"
        console.error("Error creating discount code:", errorMessage)
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error creating discount code:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to create discount code")
    }
  },

  updateDiscountCode: async (id: string, data: { active?: boolean; discountPercent?: number; description?: string }) => {
    try {
      const response = await fetch("/api/discount-codes/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to update discount code"
        console.error("Error updating discount code:", errorMessage)
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error updating discount code:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to update discount code")
    }
  },

  deleteDiscountCode: async (id: string) => {
    try {
      const response = await fetch(`/api/discount-codes/delete?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || "Failed to delete discount code"
        console.error("Error deleting discount code:", errorMessage)
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error: any) {
      console.error("Error deleting discount code:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Failed to delete discount code")
    }
  },

  validateDiscountCode: async (code: string) => {
    try {
      const response = await fetch(`/api/discount-codes/validate?code=${encodeURIComponent(code)}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data || null
    } catch (error) {
      console.error("Error validating discount code:", error)
      return null
    }
  },

  // Customer APIs
  getCustomerByPhone: async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", phone)
        .single()

      if (error) {
        // PGRST116 is "not found" - this is expected when customer doesn't exist
        if (error.code === "PGRST116") {
          return null
        }
        console.error("Supabase error fetching customer by phone:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw error
      }
      return data || null
    } catch (error: any) {
      console.error("Error fetching customer by phone:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      })
      return null
    }
  },

  createCustomer: async (customerData: { name: string; phone: string; date_of_birth?: string | null }) => {
    try {
      // Validate input
      if (!customerData.name || !customerData.phone) {
        throw new Error("Name and phone number are required")
      }

      // Clean phone number (remove spaces, ensure it starts with +94)
      const cleanPhone = customerData.phone.trim().replace(/\s+/g, "")
      
      // First, try to verify the table exists by doing a simple query
      const { error: tableCheckError } = await supabase
        .from("customers")
        .select("id")
        .limit(0)
      
      if (tableCheckError) {
        if (tableCheckError.code === "42P01" || tableCheckError.message?.includes("does not exist")) {
          throw new Error("Customers table not found. Please run the database migration file: supabase/migrations/004_create_customers_table.sql in your Supabase SQL Editor.")
        }
      }
      
      // Prepare the insert data
      const insertData: any = {
        name: customerData.name.trim(),
        phone: cleanPhone,
      }
      
      // Handle date_of_birth - explicitly set to NULL if not provided, or set the date value
      console.log("createCustomer received date_of_birth:", customerData.date_of_birth, "type:", typeof customerData.date_of_birth)
      
      if (customerData.date_of_birth && typeof customerData.date_of_birth === 'string' && customerData.date_of_birth.trim()) {
        const trimmedDate = customerData.date_of_birth.trim()
        console.log("Processing date_of_birth:", trimmedDate)
        
        // Validate date format (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
          // Validate the date is actually valid (e.g., not 2024-13-45)
          const [year, month, day] = trimmedDate.split('-').map(Number)
          const testDate = new Date(year, month - 1, day)
          
          if (testDate.getFullYear() === year && testDate.getMonth() === month - 1 && testDate.getDate() === day) {
            // Ensure it's a valid date string in YYYY-MM-DD format
            insertData.date_of_birth = trimmedDate
            console.log("✅ Setting date_of_birth to:", trimmedDate, "type:", typeof trimmedDate)
          } else {
            console.warn("❌ Invalid date value. Received:", trimmedDate, "Parsed as:", testDate)
            insertData.date_of_birth = null
          }
        } else {
          console.warn("❌ Invalid date format. Received:", trimmedDate, "Expected format: YYYY-MM-DD")
          insertData.date_of_birth = null
        }
      } else {
        console.log("date_of_birth is empty or invalid, setting to NULL")
        // Explicitly set to null - don't omit the field
        insertData.date_of_birth = null
      }
      
      console.log("Inserting customer data:", JSON.stringify(insertData, null, 2))
      console.log("date_of_birth value:", insertData.date_of_birth, "type:", typeof insertData.date_of_birth)
      
      const { data, error } = await supabase
        .from("customers")
        .insert([insertData])
        .select()
        .single()
      
      console.log("Supabase insert response - data:", data, "error:", error)

      if (error) {
        // Try to extract all possible error properties
        const errorInfo: any = {}
        try {
          // Try to get all properties from the error object
          for (const key in error) {
            try {
              errorInfo[key] = (error as any)[key]
            } catch (e) {
              errorInfo[key] = String((error as any)[key])
            }
          }
          
          // Also try JSON.stringify with replacer
          errorInfo.stringified = JSON.stringify(error, (key, value) => {
            if (value instanceof Error) {
              return {
                name: value.name,
                message: value.message,
                stack: value.stack,
              }
            }
            return value
          })
        } catch (e) {
          errorInfo.stringifyError = String(e)
        }
        
        // Log comprehensive error details
        console.error("Supabase error creating customer:", {
          error: error,
          errorInfo: errorInfo,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          status: (error as any).status,
          statusText: (error as any).statusText,
          customerData: customerData,
          insertData: insertData,
        })
        
        // Provide user-friendly error messages
        if (error.code === "23505") {
          // Unique constraint violation (duplicate phone)
          throw new Error("A customer with this phone number already exists")
        } else if (error.code === "42P01") {
          // Table doesn't exist
          throw new Error("Customers table not found. Please run the database migration: 004_create_customers_table.sql")
        } else if (error.code === "42501") {
          // Insufficient privilege (RLS policy issue)
          throw new Error("Permission denied. Please check Row Level Security policies for the customers table.")
        } else if (error.message) {
          throw new Error(error.message)
        } else if (error.details) {
          throw new Error(error.details)
        } else if (error.hint) {
          throw new Error(error.hint)
        } else {
          throw new Error("Failed to create customer. Error code: " + (error.code || "unknown") + ". Please check your database connection and ensure the customers table exists.")
        }
      }

      if (!data) {
        throw new Error("No data returned from database")
      }

      console.log("Customer created successfully. Returned data:", {
        id: data.id,
        name: data.name,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        date_of_birth_type: typeof data.date_of_birth,
        date_of_birth_raw: JSON.stringify(data.date_of_birth),
        created_at: data.created_at,
      })
      
      // Verify the date was actually saved
      if (insertData.date_of_birth && !data.date_of_birth) {
        console.error("⚠️ WARNING: date_of_birth was sent but not returned!", {
          sent: insertData.date_of_birth,
          received: data.date_of_birth
        })
      } else if (insertData.date_of_birth && data.date_of_birth) {
        console.log("✅ date_of_birth successfully saved:", data.date_of_birth)
      }

      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        created_at: data.created_at,
      }
    } catch (error: any) {
      // Enhanced error logging with better serialization
      const errorDetails: any = {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
      }
      
      // Try multiple ways to serialize the error
      try {
        errorDetails.errorString = String(error)
      } catch (e) {
        errorDetails.stringError = String(e)
      }
      
      try {
        errorDetails.errorJSON = JSON.stringify(error, (key, value) => {
          if (value instanceof Error) {
            return {
              name: value.name,
              message: value.message,
              stack: value.stack,
            }
          }
          return value
        })
      } catch (e) {
        errorDetails.jsonError = String(e)
      }
      
      // Try to get all enumerable properties
      try {
        const props: any = {}
        for (const key in error) {
          try {
            props[key] = (error as any)[key]
          } catch (e) {
            props[key] = "[Unable to access]"
          }
        }
        errorDetails.properties = props
      } catch (e) {
        errorDetails.propertiesError = String(e)
      }
      
      // Also log the raw error
      errorDetails.rawError = error
      
      console.error("Error creating customer - Full details:", errorDetails)
      
      // Re-throw if it's already a user-friendly error
      if (error instanceof Error && error.message) {
        throw error
      }
      
      // Provide a helpful error message
      const errorMessage = error?.message || 
                          error?.details || 
                          error?.hint || 
                          (error?.code ? `Database error (code: ${error.code})` : null) ||
                          "Failed to create customer. Please ensure the customers table exists by running the migration: supabase/migrations/004_create_customers_table.sql"
      
      throw new Error(errorMessage)
    }
  },

  getAllCustomers: async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name", { ascending: true })

      if (error) {
        console.error("Supabase error fetching customers:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw error
      }
      return (data || []).map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        date_of_birth: customer.date_of_birth,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      }))
    } catch (error: any) {
      console.error("Error fetching customers:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        error: error,
      })
      throw new Error(error?.message || error?.details || "Failed to fetch customers")
    }
  },

  updateCustomer: async (id: string, customerData: { name?: string; phone?: string; date_of_birth?: string | null }) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .update(customerData)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      throw error
    }
  },

  deleteCustomer: async (id: string) => {
    try {
      const { error } = await supabase.from("customers").delete().eq("id", id)
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error("Error deleting customer:", error)
      throw error
    }
  },

  getBirthdayCustomers: async (date?: Date) => {
    try {
      const targetDate = date || new Date()
      const month = targetDate.getMonth() + 1
      const day = targetDate.getDate()

      // Query customers whose birthday matches today
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .not("date_of_birth", "is", null)

      if (error) {
        console.error("Supabase error fetching birthday customers:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw error
      }

      // Filter customers whose birthday is today
      const birthdayCustomers = (data || []).filter((customer) => {
        if (!customer.date_of_birth) return false
        const dob = new Date(customer.date_of_birth)
        return dob.getMonth() + 1 === month && dob.getDate() === day
      })

      return birthdayCustomers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        date_of_birth: customer.date_of_birth,
      }))
    } catch (error: any) {
      console.error("Error fetching birthday customers:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        error: error,
      })
      throw new Error(error?.message || error?.details || "Failed to fetch birthday customers")
    }
  },

  sendBirthdaySMS: async (customerIds: string[]) => {
    try {
      const response = await fetch("/api/customers/send-birthday-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerIds }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.details || "Failed to send SMS")
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error("Error sending birthday SMS:", error)
      throw new Error(error?.message || "Failed to send birthday SMS")
    }
  },
}
