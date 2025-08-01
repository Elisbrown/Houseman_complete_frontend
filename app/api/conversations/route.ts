import { NextRequest, NextResponse } from "next/server"
import { getConversations, getUserById } from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const conversations = getConversations()
      .filter(conv => conv.participants.includes(userId))
      .map(conv => {
        // Get other participant info
        const otherParticipantId = conv.participants.find(id => id !== userId)
        const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : null
        
        return {
          ...conv,
          otherParticipant,
        }
      })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}