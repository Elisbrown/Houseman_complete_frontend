import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/mock-database"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { email, password, firstName, lastName, role, phone } = userData

    // Check if user already exists
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Create new user
    const newUser = createUser({
      email,
      firstName,
      lastName,
      phone,
      role,
      isVerified: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=6366f1&color=fff`,
    })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
