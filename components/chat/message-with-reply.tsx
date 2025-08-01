"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/components/providers/i18n-provider"
import { Reply, Check, CheckCheck } from "lucide-react"

interface MessageWithReplyProps {
  message: {
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
  onReply: (messageId: string) => void
}

export function MessageWithReply({ message, onReply }: MessageWithReplyProps) {
  const { t } = useI18n()
  const [showReplyOption, setShowReplyOption] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Handle long press for reply
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(Date.now())
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(Date.now())
    if (touchStart && Date.now() - touchStart > 500) {
      setShowReplyOption(true)
    }
  }

  // Handle swipe right for reply
  const handleSwipeStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleSwipeMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleSwipeEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchEnd - touchStart
    const isRightSwipe = distance > 50

    if (isRightSwipe && !message.isOwn) {
      onReply(message.id)
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleReplyClick = () => {
    onReply(message.id)
    setShowReplyOption(false)
  }

  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"} relative group`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 relative ${
          message.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
        }`}
        onTouchStart={handleSwipeStart}
        onTouchMove={handleSwipeMove}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        {/* Reply indicator */}
        {message.replyTo && (
          <div
            className={`mb-2 p-2 rounded border-l-2 ${
              message.isOwn
                ? "border-primary-foreground/30 bg-primary-foreground/10"
                : "border-primary/30 bg-primary/10"
            }`}
          >
            <p className={`text-xs font-medium ${message.isOwn ? "text-primary-foreground/70" : "text-primary"}`}>
              {message.replyTo.sender}
            </p>
            <p className={`text-xs ${message.isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              {message.replyTo.text || "Image"}
            </p>
          </div>
        )}

        {/* Message content */}
        {message.type === "image" ? (
          <div className="space-y-2">
            <img
              src={message.image || "/placeholder.svg"}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg cursor-pointer"
              onClick={() => window.open(message.image, "_blank")}
            />
            <div className={`flex items-center gap-1 ${message.isOwn ? "justify-end" : "justify-start"}`}>
              <span className={`text-xs ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {message.timestamp}
              </span>
              {message.isOwn && (
                <div className="text-primary-foreground/70">
                  {message.isRead ? (
                    <CheckCheck className="h-3 w-3 text-blue-400" />
                  ) : message.isDelivered ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm">{message.text}</p>
            <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? "justify-end" : "justify-start"}`}>
              <span className={`text-xs ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {message.timestamp}
              </span>
              {message.isOwn && (
                <div className="text-primary-foreground/70">
                  {message.isRead ? (
                    <CheckCheck className="h-3 w-3 text-blue-400" />
                  ) : message.isDelivered ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Reply button on hover/long press */}
        {!message.isOwn && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 bg-background shadow-md rounded-full"
            onClick={handleReplyClick}
          >
            <Reply className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Reply option popup */}
      {showReplyOption && (
        <div className="absolute top-0 left-0 right-0 z-10 animate-fade-in">
          <Card className="p-2 bg-background shadow-lg">
            <Button size="sm" variant="ghost" onClick={handleReplyClick} className="w-full justify-start">
              <Reply className="h-4 w-4 mr-2" />
              {t("chat.reply")}
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
