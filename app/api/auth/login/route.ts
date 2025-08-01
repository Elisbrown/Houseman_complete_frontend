import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/mock-database"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Check if user exists in database
    const user = getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // In a real app, you would verify the password hash
    // For demo purposes, we'll check against known passwords
    const validCredentials = [
      { email: "admin@houseman.cm", password: "HousemanAdmin2024!" },
      { email: "client@houseman.cm", password: "ClientDemo123!" },
      { email: "provider@houseman.cm", password: "ProviderDemo123!" },
      // Legacy credentials for backward compatibility
      { email: "admin@houseman.com", password: "admin123" },
      { email: "client@example.com", password: "password" },
      { email: "provider@example.com", password: "password" },
    ]

    const isValidCredential = validCredentials.some(cred => 
      cred.email === email && cred.password === password
    )

    if (!isValidCredential) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
