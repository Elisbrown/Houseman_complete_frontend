"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { AuthScreen } from "@/components/auth/auth-screen"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { ProviderDashboard } from "@/components/dashboard/provider-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "provider":
      return <ProviderDashboard />
    case "client":
    default:
      return <ClientDashboard />
  }
}
