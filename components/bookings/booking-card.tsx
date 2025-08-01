"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/providers/i18n-provider"
import { Calendar, Clock, MapPin, MessageCircle, Star } from "lucide-react"

interface BookingCardProps {
  booking: {
    id: string
    service: string
    provider?: string
    client?: string
    date: string
    time: string
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
    price: number
    image?: string
    address?: string
    rating?: number
  }
  onClick: () => void
  userRole: "client" | "provider"
}

export function BookingCard({ booking, onClick, userRole }: BookingCardProps) {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in-progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "confirmed":
        return <Calendar className="h-3 w-3" />
      case "in-progress":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <Calendar className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleContact = () => {
    console.log("Contact clicked for booking:", booking.id)
    // Navigate to chat or call
  }

  const handleReschedule = () => {
    console.log("Reschedule clicked for booking:", booking.id)
    // Open reschedule dialog
  }

  const handleCancel = () => {
    console.log("Cancel clicked for booking:", booking.id)
    // Open cancel confirmation dialog
  }

  const displayName = userRole === "client" ? booking.provider : booking.client

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {booking.image && (
            <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={booking.image || "/placeholder.svg"}
                alt={booking.service}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-sm">{booking.service}</h3>
                {displayName && (
                  <p className="text-xs text-muted-foreground">
                    {userRole === "client" ? t("booking.serviceProvider") : t("booking.client")}: {displayName}
                  </p>
                )}
              </div>
              <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(booking.status)}
                  {t(`common.${booking.status}`)}
                </div>
              </Badge>
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{booking.date}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{booking.time}</span>
              </div>

              {booking.address && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{booking.address}</span>
                </div>
              )}

              {booking.rating && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />
                  <span>{booking.rating}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-primary text-sm whitespace-nowrap flex-shrink-0">
              {booking.price.toLocaleString()} {t("currency.xaf")}
              </p>

              <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                e.stopPropagation()
                handleContact()
                }}
                className="text-xs px-2 py-1 h-7"
              >
                <MessageCircle className="h-3 w-3 mr-0" />
                {t("nav.messages")}
              </Button>

              {booking.status === "confirmed" && (
                <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReschedule()
                }}
                className="text-xs px-2 py-1 h-7"
                >
                {t("booking.reschedule")}
                </Button>
              )}

              {booking.status === "pending" && (
                <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCancel()
                }}
                className="text-xs px-2 py-1 h-7"
                >
                {t("booking.cancel")}
                </Button>
              )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
