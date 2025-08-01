import { NextRequest, NextResponse } from "next/server"
import { getAnalytics } from "@/lib/mock-database"

export async function GET() {
  try {
    const analytics = getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}