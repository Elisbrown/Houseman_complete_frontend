"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  ArrowLeft
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  messageType: "text" | "image" | "file"
  attachmentUrl?: string
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  lastActivity: string
  isActive: boolean
  otherParticipant?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    role: string
    isOnline?: boolean
  }
}

interface EnhancedChatListProps {
  userRole: "client" | "provider"
  preSelectedConversation?: string
}

export function EnhancedChatList({ userRole, preSelectedConversation }: EnhancedChatListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(preSelectedConversation || null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "conv_001",
        participants: ["client_001", "provider_001"],
        lastActivity: "2024-01-26T10:30:00.000Z",
        isActive: true,
        otherParticipant: {
          id: "provider_001",
          firstName: "Fatima",
          lastName: "Mbeki",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
          role: "provider",
          isOnline: true,
        },
        lastMessage: {
          id: "msg_003",
          conversationId: "conv_001",
          senderId: "client_001",
          receiverId: "provider_001",
          content: "Perfect! How about Thursday morning around 10 AM?",
          timestamp: "2024-01-26T10:30:00.000Z",
          isRead: false,
          messageType: "text",
        }
      },
      {
        id: "conv_002",
        participants: ["client_001", "provider_002"],
        lastActivity: "2024-01-25T16:20:00.000Z",
        isActive: true,
        otherParticipant: {
          id: "provider_002",
          firstName: "Amadou",
          lastName: "Bello",
          avatar: "https://images.unsplash.com/photo-1531384370597-9f6b3b4b94b6?w=150&h=150&fit=crop&crop=face",
          role: "provider",
          isOnline: false,
        },
        lastMessage: {
          id: "msg_005",
          conversationId: "conv_002",
          senderId: "provider_002",
          receiverId: "client_001",
          content: "Great, thank you! I'll be waiting.",
          timestamp: "2024-01-25T16:20:00.000Z",
          isRead: true,
          messageType: "text",
        }
      }
    ]

    setConversations(mockConversations)
    setLoading(false)

    // Auto-select first conversation if none selected
    if (!selectedConversation && mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0].id)
    }
  }, [selectedConversation])

  // Mock messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const mockMessages: Message[] = [
        {
          id: "msg_001",
          conversationId: selectedConversation,
          senderId: "client_001",
          receiverId: "provider_001",
          content: "Hi! I'm interested in your cleaning service. Are you available next week?",
          timestamp: "2024-01-26T09:00:00.000Z",
          isRead: true,
          messageType: "text",
        },
        {
          id: "msg_002",
          conversationId: selectedConversation,
          senderId: "provider_001",
          receiverId: "client_001",
          content: "Hello! Yes, I'm available. What day works best for you? I typically do cleaning sessions between 9 AM and 5 PM.",
          timestamp: "2024-01-26T09:15:00.000Z",
          isRead: true,
          messageType: "text",
        },
        {
          id: "msg_003",
          conversationId: selectedConversation,
          senderId: "client_001",
          receiverId: "provider_001",
          content: "Perfect! How about Thursday morning around 10 AM? My house is about 120 square meters.",
          timestamp: "2024-01-26T10:30:00.000Z",
          isRead: false,
          messageType: "text",
        }
      ]
      setMessages(mockMessages)
    }
  }, [selectedConversation])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    setSending(true)
    
    try {
      const message: Message = {
        id: `msg_${Date.now()}`,
        conversationId: selectedConversation,
        senderId: user.id,
        receiverId: "provider_001", // This should be dynamic
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
        messageType: "text",
      }

      setMessages(prev => [...prev, message])
      setNewMessage("")

      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      })
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const selectedConversationData = conversations.find(c => c.id === selectedConversation)

  const filteredConversations = conversations.filter(conv =>
    !searchQuery || 
    conv.otherParticipant?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherParticipant?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r`}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No conversations yet</p>
              <p className="text-sm">Start by booking a service!</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`m-2 cursor-pointer transition-all ${
                  selectedConversation === conversation.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.otherParticipant?.avatar} />
                        <AvatarFallback>
                          {conversation.otherParticipant?.firstName?.[0]}
                          {conversation.otherParticipant?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.otherParticipant?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {conversation.otherParticipant?.firstName} {conversation.otherParticipant?.lastName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.lastActivity), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                        {conversation.lastMessage && !conversation.lastMessage.isRead && (
                          <Badge variant="default" className="h-5 w-5 rounded-full p-0 text-xs">
                            1
                          </Badge>
                        )}
                      </div>
                      
                      <Badge variant="secondary" className="text-xs mt-1">
                        {conversation.otherParticipant?.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedConversation ? (
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversationData?.otherParticipant?.avatar} />
                    <AvatarFallback>
                      {selectedConversationData?.otherParticipant?.firstName?.[0]}
                      {selectedConversationData?.otherParticipant?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversationData?.otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                  )}
                </div>
                
                <div>
                  <p className="font-medium">
                    {selectedConversationData?.otherParticipant?.firstName} {selectedConversationData?.otherParticipant?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversationData?.otherParticipant?.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${
                  message.senderId === user?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                } rounded-lg p-3`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="min-h-[40px] resize-none"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-2">Select a conversation</p>
            <p className="text-sm">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}