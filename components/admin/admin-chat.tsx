"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedChatWindow } from "../chat/enhanced-chat-window"
import { useI18n } from "@/components/providers/i18n-provider"
import { Search, MessageCircle, AlertTriangle, Send } from "lucide-react"

const mockUsers = [
  {
    id: "1",
    name: "Jean Kouam",
    email: "jean@example.com",
    role: "client",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "I need help with my booking",
    timestamp: "2 min ago",
    unreadCount: 1,
    service: "Support Request",
  },
  {
    id: "2",
    name: "Marie Dubois",
    email: "marie@example.com",
    role: "provider",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "How do I update my services?",
    timestamp: "1 hour ago",
    unreadCount: 0,
    service: "Account Help",
  },
  {
    id: "3",
    name: "Paul Ngozi",
    email: "paul@example.com",
    role: "provider",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "My KYC was rejected",
    timestamp: "3 hours ago",
    unreadCount: 2,
    service: "KYC Support",
  },
]

const mockReports = [
  {
    id: "1",
    reportedUser: "Samuel Kone",
    reportedBy: "Alice Johnson",
    reason: "Inappropriate behavior during service",
    timestamp: "1 hour ago",
    status: "pending",
    severity: "high",
  },
  {
    id: "2",
    reportedUser: "Michel Fotso",
    reportedBy: "Bob Smith",
    reason: "Service not delivered as promised",
    timestamp: "3 hours ago",
    status: "investigating",
    severity: "medium",
  },
]

export function AdminChat() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("support")
  const [broadcastMessage, setBroadcastMessage] = useState("")

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.service.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChatClick = (userId: string) => {
    setSelectedChat(userId)
  }

  const handleSendBroadcast = () => {
    if (broadcastMessage.trim()) {
      console.log("Broadcasting message:", broadcastMessage)
      setBroadcastMessage("")
      // Implement broadcast logic
    }
  }

  const handleReportAction = (reportId: string, action: "resolve" | "investigate" | "escalate") => {
    console.log(`Report ${reportId} action: ${action}`)
    // Implement report action logic
  }

  if (selectedChat) {
    const user = mockUsers.find((u) => u.id === selectedChat)
    if (user) {
      return (
        <EnhancedChatWindow
          chat={{
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            isOnline: user.isOnline,
            service: user.service,
            isOfficial: false,
            isVerified: false,
          }}
          onBack={() => setSelectedChat(null)}
          userRole="admin"
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Chat Center</h1>
        <Badge variant="outline" className="text-sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          Official Support
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="support">User Support</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* User List */}
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleChatClick(user.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{user.name}</h3>
                          <Badge variant={user.role === "provider" ? "default" : "secondary"} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{user.timestamp}</span>
                          {user.unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                              {user.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-1">{user.service}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Broadcast Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message to all users:</label>
                <textarea
                  placeholder="Type your broadcast message here..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSendBroadcast} disabled={!broadcastMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Broadcast
                </Button>
                <Button variant="outline" onClick={() => setBroadcastMessage("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Broadcasts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm mb-2">Welcome to Houseman! We're excited to have you on board.</p>
                  <p className="text-xs text-muted-foreground">Sent 2 days ago • 1,234 recipients</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm mb-2">System maintenance scheduled for tonight from 2-4 AM.</p>
                  <p className="text-xs text-muted-foreground">Sent 1 week ago • 1,156 recipients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {mockReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          report.severity === "high"
                            ? "text-red-500"
                            : report.severity === "medium"
                              ? "text-yellow-500"
                              : "text-blue-500"
                        }`}
                      />
                      <h3 className="font-medium">Report #{report.id}</h3>
                      <Badge
                        variant={
                          report.status === "pending"
                            ? "destructive"
                            : report.status === "investigating"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{report.timestamp}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <strong>Reported User:</strong> {report.reportedUser}
                    </p>
                    <p className="text-sm">
                      <strong>Reported By:</strong> {report.reportedBy}
                    </p>
                    <p className="text-sm">
                      <strong>Reason:</strong> {report.reason}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "investigate")}>
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "resolve")}>
                      Resolve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReportAction(report.id, "escalate")}>
                      Escalate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
