import { NextRequest, NextResponse } from "next/server"
import { getServices, createService, searchServices } from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const location = searchParams.get("location")

    let services
    if (query || category || minPrice || maxPrice || location) {
      // Search with filters
      const filters: any = {}
      if (category) filters.category = category
      if (minPrice) filters.minPrice = parseInt(minPrice)
      if (maxPrice) filters.maxPrice = parseInt(maxPrice)
      if (location) filters.location = location

      services = searchServices(query || "", filters)
    } else {
      // Get all services
      services = getServices().filter(service => service.isActive)
    }

    return NextResponse.json(services)
  } catch (error) {
    console.error("Services API error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json()
    const newService = createService(serviceData)
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Create service error:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}