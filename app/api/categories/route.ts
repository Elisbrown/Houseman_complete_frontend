import { NextRequest, NextResponse } from "next/server"
import { getCategories } from "@/lib/mock-database"

export async function GET() {
  try {
    const categories = getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}