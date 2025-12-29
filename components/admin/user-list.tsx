"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface UserListProps {
  users: any[]
  onToggleUser: (userId: string, enabled: boolean, userEmail: string) => void
  defaultAdminEmail?: string
}

export default function UserList({ users, onToggleUser, defaultAdminEmail }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">No users found.</p>
      </div>
    )
  }

  const isDefaultAdmin = (email: string) => {
    return defaultAdminEmail && email.toLowerCase() === defaultAdminEmail.toLowerCase()
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Email</TableHead>
            <TableHead className="text-xs sm:text-sm">Role</TableHead>
            <TableHead className="text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Created</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isDefault = isDefaultAdmin(user.email)
            const cannotDisable = isDefault && user.enabled

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-xs sm:text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="text-[10px] sm:text-xs"
                  >
                    {user.role === "admin" ? "Admin" : "Biller"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.enabled ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                    {user.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {cannotDisable ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-xs sm:text-sm h-8 sm:h-9"
                            disabled
                          >
                            Disable
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The default admin account cannot be disabled</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Button
                      onClick={() => onToggleUser(user.id, user.enabled, user.email)}
                      variant={user.enabled ? "destructive" : "outline"}
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      {user.enabled ? "Disable" : "Enable"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
