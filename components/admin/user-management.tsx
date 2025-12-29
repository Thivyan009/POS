"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UserList from "./user-list"

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const billers = await apiService.getBillers()
      setUsers(billers)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUser = async (userId: string, enabled: boolean) => {
    try {
      const result = await apiService.updateBiller(userId, { enabled: !enabled })
      setUsers(users.map((u) => (u.id === userId ? result : u)))
      toast({
        title: "Success",
        description: `User ${!enabled ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">User Management</h2>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Biller Accounts</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage biller accounts. Disable a user to prevent login without deleting their record.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <UserList users={users} onToggleUser={handleToggleUser} />
        </CardContent>
      </Card>
    </div>
  )
}
