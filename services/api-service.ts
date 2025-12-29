// API Service Layer - Abstracts all backend calls
// In production, replace with actual API endpoints

export const apiService = {
  // Menu APIs
  getMenuCategories: async () => {
    // Mock data - Replace with actual API call
    return [
      { id: "1", name: "Appetizers" },
      { id: "2", name: "Main Course" },
      { id: "3", name: "Desserts" },
      { id: "4", name: "Beverages" },
    ]
  },

  getMenuItems: async (categoryId?: string) => {
    // Mock data - Replace with actual API call
    return [
      { id: "1", name: "Burger", price: 8.99, categoryId: "2", tax: true, available: true },
      { id: "2", name: "Pizza", price: 12.99, categoryId: "2", tax: true, available: true },
      { id: "3", name: "Salad", price: 6.99, categoryId: "1", tax: true, available: true },
      { id: "4", name: "Fries", price: 3.99, categoryId: "1", tax: false, available: true },
      { id: "5", name: "Ice Cream", price: 4.99, categoryId: "3", tax: true, available: false },
      { id: "6", name: "Coffee", price: 2.99, categoryId: "4", tax: false, available: true },
      { id: "7", name: "Soda", price: 2.49, categoryId: "4", tax: true, available: true },
      { id: "8", name: "Pasta", price: 10.99, categoryId: "2", tax: true, available: true },
    ]
  },

  // Bill APIs
  createBill: async (billData: any) => {
    // In production, POST to /api/bills
    return { id: `bill-${Date.now()}`, ...billData, status: "completed" }
  },

  getBills: async (page = 1, limit = 20) => {
    // In production, GET from /api/bills with pagination
    return { bills: [], total: 0, page }
  },

  // Analytics APIs
  getRevenue: async () => {
    return {
      today: 1250.5,
      thisWeek: 8750.25,
      thisMonth: 35420.0,
    }
  },

  getSalesByHour: async () => {
    return [
      { hour: "08:00", sales: 120 },
      { hour: "09:00", sales: 250 },
      { hour: "10:00", sales: 380 },
      { hour: "11:00", sales: 520 },
      { hour: "12:00", sales: 890 },
      { hour: "13:00", sales: 750 },
      { hour: "14:00", sales: 420 },
      { hour: "15:00", sales: 280 },
    ]
  },

  getTopItems: async () => {
    return [
      { name: "Pizza", count: 145 },
      { name: "Burger", count: 132 },
      { name: "Pasta", count: 98 },
      { name: "Salad", count: 76 },
      { name: "Coffee", count: 210 },
    ]
  },

  // User APIs
  getBillers: async () => {
    return [
      { id: "1", username: "john", enabled: true },
      { id: "2", username: "jane", enabled: true },
      { id: "3", username: "mike", enabled: false },
    ]
  },

  updateBiller: async (id: string, data: any) => {
    return { id, ...data }
  },
}
