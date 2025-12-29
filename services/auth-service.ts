// Authentication Service - Handles user login and authentication
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  role: "admin" | "biller"
  enabled: boolean
}

export const authService = {
  /**
   * Authenticate user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthUser | null> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        return null
      }

      const user = await response.json()
      return user as AuthUser
    } catch (error) {
      console.error("Error during login:", error)
      return null
    }
  },

  /**
   * Get current user from session
   */
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("pos-user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  /**
   * Set user session
   */
  setSession: (user: AuthUser): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("pos-user", JSON.stringify(user))
    localStorage.setItem("pos-token", `token-${Date.now()}`)
    localStorage.setItem("pos-role", user.role)
    localStorage.setItem("pos-email", user.email)
  },

  /**
   * Clear user session
   */
  clearSession: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem("pos-user")
    localStorage.removeItem("pos-token")
    localStorage.removeItem("pos-role")
    localStorage.removeItem("pos-email")
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null
  },
}

