import { NextRequest, NextResponse } from "next/server"
import { 
  getMessagesByConversation, 
  createMessage, 
  getConversationByParticipants,
  createConversation 
} from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")
    
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    const messages = getMessagesByConversation(conversationId)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const messageData = await request.json()
    const { senderId, receiverId, content, messageType = "text" } = messageData

    // Find or create conversation
    let conversation = getConversationByParticipants(senderId, receiverId)
    if (!conversation) {
      conversation = createConversation([senderId, receiverId])
    }

    const newMessage = createMessage({
      conversationId: conversation.id,
      senderId,
      receiverId,
      content,
      messageType,
      isRead: false,
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Create message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}