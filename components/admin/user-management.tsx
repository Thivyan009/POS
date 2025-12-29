"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import UserList from "./user-list"
import { Plus } from "lucide-react"

// Default admin email that cannot be disabled
const DEFAULT_ADMIN_EMAIL = "paruthimunaitech@gmail.com"

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "biller" as "admin" | "biller",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const allUsers = await apiService.getAllUsers()
      setUsers(allUsers)
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

  const handleToggleUser = async (userId: string, enabled: boolean, userEmail: string) => {
    // Prevent disabling the default admin account
    if (userEmail.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() && enabled) {
      toast({
        title: "Cannot Disable",
        description: "The default admin account cannot be disabled",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await apiService.updateUser(userId, { enabled: !enabled })
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const newUser = await apiService.createUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      setUsers([...users, newUser])
      setIsDialogOpen(false)
      setFormData({ email: "", password: "", role: "biller" })
      toast({
        title: "Success",
        description: `${formData.role === "admin" ? "Admin" : "Biller"} user created successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const admins = users.filter((u) => u.role === "admin")
  const billers = users.filter((u) => u.role === "biller")

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">User Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new admin or biller account to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "biller") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="biller">Biller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Admin Accounts</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage admin accounts. Admins have full access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <UserList users={admins} onToggleUser={handleToggleUser} defaultAdminEmail={DEFAULT_ADMIN_EMAIL} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Biller Accounts</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage biller accounts. Billers can create bills and manage sales.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <UserList users={billers} onToggleUser={handleToggleUser} defaultAdminEmail={DEFAULT_ADMIN_EMAIL} />
        </CardContent>
      </Card>
    </div>
  )
}
