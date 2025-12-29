// Database types for the POS system

export interface MenuCategory {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category_id: string
  tax: boolean
  available: boolean
  created_at?: string
  updated_at?: string
}

export interface BillItem {
  id: string
  name: string
  price: number
  quantity: number
  tax: boolean
}

export interface Bill {
  id: string
  items: BillItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  status: 'completed' | 'pending' | 'cancelled'
  whatsapp_number?: string | null
  created_at: string
  created_by?: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'biller'
  enabled: boolean
  created_at?: string
  updated_at?: string
}

export interface DiscountCode {
  id: string
  code: string
  discount_percent: number
  description?: string | null
  active: boolean
  created_at: string
  updated_at?: string
}

// Database row types (with snake_case)
export interface MenuCategoryRow {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface MenuItemRow {
  id: string
  name: string
  price: number
  category_id: string
  tax: boolean
  available: boolean
  created_at?: string
  updated_at?: string
}

export interface BillRow {
  id: string
  subtotal: number
  tax: number
  discount: number
  total: number
  status: 'completed' | 'pending' | 'cancelled'
  whatsapp_number?: string | null
  created_at: string
  created_by?: string
}

export interface BillItemRow {
  id: string
  bill_id: string
  menu_item_id: string
  item_name: string
  price: number
  quantity: number
  tax: boolean
  created_at?: string
}

export interface UserRow {
  id: string
  email: string
  role: 'admin' | 'biller'
  enabled: boolean
  password_hash?: string
  created_at?: string
  updated_at?: string
}

export interface DiscountCodeRow {
  id: string
  code: string
  discount_percent: number
  description?: string | null
  active: boolean
  created_at: string
  updated_at?: string
}

