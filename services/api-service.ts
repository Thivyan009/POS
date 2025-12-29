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
    whatsappNumber?: string | null
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
            whatsapp_number: billData.whatsappNumber || null,
            created_by: billData.createdBy || null,
            status: "completed",
          },
        ])
        .select()
        .single()

      if (billError) throw billError

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

      if (itemsError) throw itemsError

      return {
        id: bill.id,
        ...billData,
        status: "completed",
        createdAt: bill.created_at,
      }
    } catch (error) {
      console.error("Error creating bill:", error)
      throw error
    }
  },

  getBills: async (page = 1, limit = 20, fromDate?: Date, toDate?: Date) => {
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

      const { data, error, count } = await query

      if (error) throw error

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
            whatsapp_number: bill.whatsapp_number,
            created_by: bill.created_by,
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

      // Convert to array and sort by hour
      return Object.entries(salesByHour)
        .map(([hour, sales]) => ({ hour, sales }))
        .sort((a, b) => a.hour.localeCompare(b.hour))
    } catch (error) {
      console.error("Error fetching sales by hour:", error)
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
}
