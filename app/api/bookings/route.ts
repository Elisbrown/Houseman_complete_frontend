import { NextRequest, NextResponse } from "next/server"
import { 
  getBookings, 
  getBookingsByClient, 
  getBookingsByProvider, 
  createBooking,
  createNotification 
} from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const providerId = searchParams.get("providerId")

    let bookings
    if (clientId) {
      bookings = getBookingsByClient(clientId)
    } else if (providerId) {
      bookings = getBookingsByProvider(providerId)
    } else {
      bookings = getBookings()
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    const newBooking = createBooking({
      ...bookingData,
      status: "pending",
    })

    // Create notification for provider
    createNotification({
      userId: newBooking.providerId,
      title: "New Booking Request",
      message: `You have a new booking request for ${bookingData.scheduledDate}`,
      type: "booking",
      isRead: false,
      actionUrl: `/bookings/${newBooking.id}`,
    })

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}