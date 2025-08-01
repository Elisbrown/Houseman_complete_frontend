"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { EnhancedChatWindow } from "./enhanced-chat-window"
import { useI18n } from "@/components/providers/i18n-provider"
import { Search, MessageCircle } from "lucide-react"

interface ChatListProps {
  userRole: "client" | "provider"
}

const mockChats = [
  {
    id: "1",
    name: "Marie Dubois",
    lastMessage: "I'll be there at 10 AM tomorrow",
    timestamp: "2 min ago",
    unreadCount: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    service: "Home Cleaning",
  },
  {
    id: "2",
    name: "Jean Baptiste",
    lastMessage: "The electrical work is completed",
    timestamp: "1 hour ago",
    unreadCount: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    service: "Electrical Repair",
  },
  {
    id: "3",
    name: "Paul Ngozi",
    lastMessage: "When would you like to schedule the painting?",
    timestamp: "Yesterday",
    unreadCount: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    service: "Apartment Painting",
  },
]

export function ChatList({ userRole }: ChatListProps) {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [filteredChats, setFilteredChats] = useState(mockChats)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = mockChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.service.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredChats(filtered)
  }

  const handleChatClick = (chatId: string) => {
    setSelectedChat(chatId)
    console.log("Chat clicked:", chatId)
  }

  const formatTimestamp = (timestamp: string) => {
    // Simple timestamp formatting - in real app, use proper date formatting
    return timestamp
  }

  if (selectedChat) {
    const chat = mockChats.find((c) => c.id === selectedChat)
    return <EnhancedChatWindow chat={chat!} onBack={() => setSelectedChat(null)} userRole={userRole} />
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Chat List */}
      <div className="space-y-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Card
              key={chat.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => handleChatClick(chat.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatTimestamp(chat.timestamp)}</span>
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-1">{chat.service}</p>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No conversations found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Start a conversation by booking a service"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
