"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageWithReply } from "./message-with-reply"
import { CallInterface } from "../call/call-interface"
import { useI18n } from "@/components/providers/i18n-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, Phone, MoreVertical, ImageIcon, Smile, Flag, Shield, X } from "lucide-react"

interface EnhancedChatWindowProps {
  chat: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    service: string
    isOfficial?: boolean
    isVerified?: boolean
  }
  onBack: () => void
  userRole: "client" | "provider" | "admin"
}

interface Message {
  id: string
  text?: string
  image?: string
  timestamp: string
  isOwn: boolean
  isRead: boolean
  isDelivered: boolean
  type: "text" | "image" | "system"
  replyTo?: {
    id: string
    text?: string
    image?: string
    sender: string
  }
}

const emojis = ["😀", "😂", "😍", "👍", "👎", "❤️", "🔥", "💯", "😢", "😡", "🤔", "👌", "🙏", "💪", "🎉", "✅"]

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm interested in your home cleaning service.",
    timestamp: "10:30 AM",
    isOwn: true,
    isRead: true,
    isDelivered: true,
    type: "text",
  },
  {
    id: "2",
    text: "Hi! Thank you for your interest. I'd be happy to help you with home cleaning.",
    timestamp: "10:32 AM",
    isOwn: false,
    isRead: false,
    isDelivered: true,
    type: "text",
  },
  {
    id: "3",
    text: "What's your availability for this weekend?",
    timestamp: "10:33 AM",
    isOwn: true,
    isRead: true,
    isDelivered: true,
    type: "text",
  },
  {
    id: "4",
    text: "I'm available on Saturday morning. Would 10 AM work for you?",
    timestamp: "10:35 AM",
    isOwn: false,
    isRead: false,
    isDelivered: true,
    type: "text",
  },
]

export function EnhancedChatWindow({ chat, onBack, userRole }: EnhancedChatWindowProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [showCallInterface, setShowCallInterface] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        isRead: false,
        isDelivered: true,
        type: "text",
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              image: replyingTo.image,
              sender: chat.name,
            }
          : undefined,
      }

      setMessages([...messages, message])
      setNewMessage("")
      setReplyingTo(null)

      // Simulate typing indicator and response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG, PNG, or GIF image.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      // Create image message
      const imageUrl = URL.createObjectURL(file)
      const message: Message = {
        id: Date.now().toString(),
        image: imageUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        isRead: false,
        isDelivered: true,
        type: "image",
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              image: replyingTo.image,
              sender: chat.name,
            }
          : undefined,
      }

      setMessages([...messages, message])
      setReplyingTo(null)
      toast({
        title: "Image sent",
        description: "Your image has been sent successfully.",
      })
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojis(false)
  }

  const handleReply = (messageId: string) => {
    const messageToReply = messages.find((m) => m.id === messageId)
    if (messageToReply) {
      setReplyingTo(messageToReply)
    }
  }

  const handleCall = () => {
    setShowCallInterface(true)
  }

  const handleEndCall = () => {
    setShowCallInterface(false)
  }

  const handleBlock = () => {
    toast({
      title: "User blocked",
      description: `${chat.name} has been blocked successfully.`,
    })
    setShowBlockDialog(false)
    onBack()
  }

  const handleReport = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Report reason required",
        description: "Please provide a reason for reporting this user.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Report submitted",
      description: "Thank you for your report. We'll review it shortly.",
    })
    setShowReportDialog(false)
    setReportReason("")
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return t("chat.today")
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("chat.yesterday")
    } else {
      return date.toLocaleDateString()
    }
  }

  const getVerificationBadge = () => {
    if (chat.isOfficial) {
      return (
        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )
    } else if (chat.isVerified) {
      return (
        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )
    }
    return null
  }

  if (showCallInterface) {
    return (
      <CallInterface
        contact={{
          id: chat.id,
          name: chat.name,
          avatar: chat.avatar,
          isVerified: chat.isVerified,
          isOfficial: chat.isOfficial,
        }}
        onEndCall={handleEndCall}
        callType="outgoing"
      />
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card animate-slide-in-down">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {chat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {chat.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
            {getVerificationBadge()}
          </div>
          <p className="text-xs text-muted-foreground">
            {chat.isOnline ? t("chat.online") : `${t("chat.lastSeen")} 2 hours ago`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCall} className="hover:bg-green-50 hover:text-green-600">
            <Phone className="h-4 w-4" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chat Options</DialogTitle>
                <DialogDescription>Manage this conversation</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowReportDialog(true)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report User
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setShowBlockDialog(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Block User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Service Context */}
      <div className="p-3 bg-muted/50 border-b animate-slide-in-down delay-100">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {chat.service}
          </Badge>
          <span className="text-xs text-muted-foreground">Booking discussion</span>
        </div>
      </div>

      {/* Platform Guidelines */}
      <div className="p-3 bg-yellow-50 border-b border-yellow-200 animate-slide-in-down delay-200">
        <p className="text-xs text-yellow-800 text-center">
          🔒 {t("chat.platformGuideline")}: Keep all communication within Houseman for your security. Report any
          requests for external payment or suspicious activity.
        </p>
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="p-3 bg-blue-50 border-b border-blue-200 animate-slide-in-down">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-blue-600 font-medium">Replying to {chat.name}</p>
              <p className="text-sm text-blue-800 truncate">{replyingTo.text || "Image"}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Header */}
        <div className="text-center animate-fade-in">
          <Badge variant="secondary" className="text-xs">
            {formatDate(new Date())}
          </Badge>
        </div>

        {messages.map((message, index) => (
          <div key={message.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <MessageWithReply message={message} onReply={handleReply} />
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">{t("chat.typing")}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="p-4 border-t bg-card animate-slide-in-up">
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-muted hover:scale-110 transition-all duration-200"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-card animate-slide-in-up">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojis(!showEmojis)}
            className="flex-shrink-0 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <Smile className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder={t("chat.typeMessage")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 rounded-full transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full w-10 h-10 p-0 flex-shrink-0 hover:scale-110 transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Please tell us why you're reporting {chat.name}. This will help us keep the platform safe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the issue..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleReport} className="flex-1">
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {chat.name}? They won't be able to message you anymore.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBlockDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlock} className="flex-1">
              Block User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
