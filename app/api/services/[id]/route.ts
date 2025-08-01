import { NextRequest, NextResponse } from "next/server"
import { getServiceById, updateService, deleteService } from "@/lib/mock-database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = getServiceById(params.id)
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    console.error("Get service error:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const updatedService = updateService(params.id, updates)
    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Update service error:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteService(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Delete service error:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}