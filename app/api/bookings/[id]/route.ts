import { NextRequest, NextResponse } from "next/server"
import { getBookingById, updateBooking, createNotification } from "@/lib/mock-database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = getBookingById(params.id)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const updatedBooking = updateBooking(params.id, updates)
    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Create notification based on status change
    if (updates.status) {
      const notificationTargetId = updates.status === "accepted" || updates.status === "cancelled" 
        ? updatedBooking.clientId 
        : updatedBooking.providerId
      
      let message = ""
      switch (updates.status) {
        case "accepted":
          message = "Your booking request has been accepted"
          break
        case "cancelled":
          message = "Your booking has been cancelled"
          break
        case "completed":
          message = "Your booking has been marked as completed"
          break
        case "in-progress":
          message = "Your service provider is on the way"
          break
      }

      if (message) {
        createNotification({
          userId: notificationTargetId,
          title: "Booking Update",
          message,
          type: "booking",
          isRead: false,
          actionUrl: `/bookings/${updatedBooking.id}`,
        })
      }
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}