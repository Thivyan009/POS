"use client"

import { AuthGuard } from "@/components/auth-guard"
import BillerLayout from "@/components/biller/biller-layout"

export default function BillerPage() {
  return (
    <AuthGuard requiredRole="biller">
      <BillerLayout />
    </AuthGuard>
  )
}
