"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  ArrowLeft,
  Reply,
  Star,
  Copy,
  Trash2,
  Flag,
  Shield,
  UserX,
  Heart,
  Smile
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

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
  isStarred?: boolean
  replyTo?: {
    id: string
    content: string
    senderName: string
  }
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
    rating?: number
  }
}

interface WhatsAppChatProps {
  userRole: "client" | "provider"
  preSelectedConversation?: string
}

export function WhatsAppChat({ userRole, preSelectedConversation }: WhatsAppChatProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

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
          rating: 4.8,
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
          rating: 4.5,
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
      },
      {
        id: "conv_003",
        participants: ["client_001", "provider_003"],
        lastActivity: "2024-01-24T14:15:00.000Z",
        isActive: true,
        otherParticipant: {
          id: "provider_003",
          firstName: "Marie",
          lastName: "Dubois",
          avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=150&h=150&fit=crop&crop=face",
          role: "provider",
          isOnline: true,
          rating: 4.9,
        },
        lastMessage: {
          id: "msg_006",
          conversationId: "conv_003",
          senderId: "provider_003",
          receiverId: "client_001",
          content: "Hi! I saw your booking request. When would you like to schedule the painting job?",
          timestamp: "2024-01-24T14:15:00.000Z",
          isRead: true,
          messageType: "text",
        }
      }
    ]

    setConversations(mockConversations)
    setLoading(false)

    // Only auto-select if a conversation is pre-selected
    if (preSelectedConversation) {
      setSelectedConversation(preSelectedConversation)
    }
  }, [preSelectedConversation])

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

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
        replyTo: replyingTo ? {
          id: replyingTo.id,
          content: replyingTo.content,
          senderName: replyingTo.senderId === user.id ? "You" : "Provider"
        } : undefined
      }

      setMessages(prev => [...prev, message])
      setNewMessage("")
      setReplyingTo(null)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReply = (message: Message) => {
    setReplyingTo(message)
    inputRef.current?.focus()
  }

  const handleStarMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
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

  // Chat List View (Default State)
  if (!selectedConversation) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
        {/* Header */}
        <div className="p-4 border-b bg-green-600 text-white">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No conversations yet</p>
              <p className="text-sm">Start by booking a service!</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedConversation(conversation.id)}
              >
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
                      {format(new Date(conversation.lastActivity), "HH:mm")}
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
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {conversation.otherParticipant?.role}
                    </Badge>
                    {conversation.otherParticipant?.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {conversation.otherParticipant.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Individual Chat View
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
      {/* Security Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-xs text-yellow-800 sticky top-0 z-10">
        <div className="flex">
          <Shield className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <p>Keep all conversations within this platform for your security and incident reports. We ensure your safety using our services.</p>
        </div>
      </div>

      {/* Chat Header */}
      <div className="p-4 border-b bg-green-600 text-white sticky top-8 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-700"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversationData?.otherParticipant?.avatar} />
                <AvatarFallback className="bg-white text-green-600">
                  {selectedConversationData?.otherParticipant?.firstName?.[0]}
                  {selectedConversationData?.otherParticipant?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {selectedConversationData?.otherParticipant?.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
              )}
            </div>
            
            <div>
              <p className="font-medium">
                {selectedConversationData?.otherParticipant?.firstName} {selectedConversationData?.otherParticipant?.lastName}
              </p>
              <p className="text-xs text-green-100">
                {selectedConversationData?.otherParticipant?.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
              <Phone className="h-4 w-4" />
            </Button>
            
            {/* Profile Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Heart className="h-4 w-4 mr-2" />
                  Rate Provider
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report User
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <UserX className="h-4 w-4 mr-2" />
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className="relative group max-w-[70%]">
              {/* Reply Reference */}
              {message.replyTo && (
                <div className="mb-2 p-2 bg-gray-200 rounded-t-lg border-l-4 border-green-500">
                  <p className="text-xs text-green-600 font-medium">{message.replyTo.senderName}</p>
                  <p className="text-sm text-gray-700 truncate">{message.replyTo.content}</p>
                </div>
              )}
              
              <div className={`${
                message.senderId === user?.id 
                  ? 'bg-green-500 text-white rounded-l-2xl rounded-tr-2xl rounded-br-md' 
                  : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl rounded-bl-md shadow-sm'
              } p-3 relative`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                <div className="flex items-center justify-between mt-1 gap-2">
                  <p className={`text-xs ${
                    message.senderId === user?.id 
                      ? 'text-green-100' 
                      : 'text-gray-500'
                  }`}>
                    {format(new Date(message.timestamp), "HH:mm")}
                  </p>
                  
                  {message.isStarred && (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Message Actions */}
              <div className="absolute top-0 right-0 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 bg-white rounded-full shadow-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleReply(message)}
                  >
                    <Reply className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleStarMessage(message.id)}
                  >
                    <Star className={`h-3 w-3 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Text
                      </DropdownMenuItem>
                      {message.senderId === user?.id && (
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-green-50 border-t flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-green-600 font-medium">
              Replying to {replyingTo.senderId === user?.id ? "yourself" : "provider"}
            </p>
            <p className="text-sm text-gray-700 truncate">{replyingTo.content}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(null)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}

      {/* Message Input - Sticky Bottom */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] max-h-32 resize-none pr-12 rounded-3xl border-gray-300 focus:border-green-500"
              rows={1}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="h-10 w-10 rounded-full bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}