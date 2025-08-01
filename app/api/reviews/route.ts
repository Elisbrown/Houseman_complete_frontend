import { NextRequest, NextResponse } from "next/server"
import { 
  getReviews, 
  getReviewsByProvider, 
  createReview,
  createNotification,
  updateUser,
  getUserById 
} from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    let reviews
    if (providerId) {
      reviews = getReviewsByProvider(providerId)
    } else {
      reviews = getReviews()
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Reviews API error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()
    const newReview = createReview(reviewData)

    // Update provider's rating
    const provider = getUserById(reviewData.providerId)
    if (provider) {
      const providerReviews = getReviewsByProvider(reviewData.providerId)
      const averageRating = providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerReviews.length
      
      updateUser(reviewData.providerId, {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: providerReviews.length,
      })
    }

    // Create notification for provider
    createNotification({
      userId: reviewData.providerId,
      title: "New Review Received",
      message: `You received a ${reviewData.rating}-star review`,
      type: "review",
      isRead: false,
      actionUrl: "/reviews",
    })

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}