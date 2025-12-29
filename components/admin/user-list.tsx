"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  onToggleUser: (userId: string, enabled: boolean) => void
}

export default function UserList({ users, onToggleUser }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">No users found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Username</TableHead>
            <TableHead className="text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Last Login</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium text-xs sm:text-sm">{user.username}</TableCell>
              <TableCell>
                <Badge variant={user.enabled ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                  {user.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                {user.lastLogin || "Never"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => onToggleUser(user.id, user.enabled)}
                  variant={user.enabled ? "destructive" : "outline"}
                  size="sm"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  {user.enabled ? "Disable" : "Enable"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
