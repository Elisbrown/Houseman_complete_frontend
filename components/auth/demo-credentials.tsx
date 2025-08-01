"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, User, Shield, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CredentialSet {
  role: "admin" | "client" | "provider"
  email: string
  password: string
  name: string
  description: string
  features: string[]
}

const demoCredentials: CredentialSet[] = [
  {
    role: "admin",
    email: "admin@houseman.cm",
    password: "HousemanAdmin2024!",
    name: "Sarah Mbeki",
    description: "Platform Administrator",
    features: [
      "User Management Dashboard",
      "KYC Verification System",
      "Service Provider Approval",
      "Platform Analytics",
      "Content Moderation",
      "System Configuration",
    ],
  },
  {
    role: "client",
    email: "client@houseman.cm",
    password: "ClientDemo123!",
    name: "Jean Kouam",
    description: "Service Consumer",
    features: [
      "Service Discovery",
      "Provider Search & Filtering",
      "Booking Management",
      "Real-time Chat",
      "Review & Rating System",
      "Profile Management",
    ],
  },
  {
    role: "provider",
    email: "provider@houseman.cm",
    password: "ProviderDemo123!",
    name: "Marie Dubois",
    description: "Verified Service Provider",
    features: [
      "Service Listing Management",
      "Booking Requests",
      "Client Communication",
      "Earnings Dashboard",
      "KYC Verification",
      "Performance Analytics",
    ],
  },
]

export function DemoCredentials() {
  const { toast } = useToast()

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`)
    toast({
      title: "Credentials copied!",
      description: "Login credentials have been copied to clipboard.",
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5" />
      case "provider":
        return <Briefcase className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "provider":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Demo Credentials</h2>
        <p className="text-muted-foreground text-sm">
          Use these credentials to explore different user roles in the Houseman platform
        </p>
      </div>

      {demoCredentials.map((cred) => (
        <Card key={cred.role} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getRoleColor(cred.role)}`}>{getRoleIcon(cred.role)}</div>
                <div>
                  <CardTitle className="text-lg">{cred.name}</CardTitle>
                  <CardDescription>{cred.description}</CardDescription>
                </div>
              </div>
              <Badge className={getRoleColor(cred.role)}>{cred.role.toUpperCase()}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Credentials */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm text-muted-foreground font-mono">{cred.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Password:</p>
                  <p className="text-sm text-muted-foreground font-mono">{cred.password}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCredentials(cred.email, cred.password)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-sm font-medium mb-2">Available Features:</p>
              <div className="grid grid-cols-1 gap-1">
                {cred.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Demo Environment</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                These are demo credentials for testing purposes. In production, use secure authentication methods and
                never share real credentials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
