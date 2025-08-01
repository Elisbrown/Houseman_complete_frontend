"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RescheduleModal } from "@/components/booking/reschedule-modal"
import { WhatsAppChat } from "@/components/chat/whatsapp-chat"
import { useToast } from "@/hooks/use-toast"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle,
  MoreVertical,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react"
import { format } from "date-fns"

interface BookingCardProps {
  booking: {
    id: string
    service: string
    provider: string
    date: string
    time: string
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
    price: number
    image: string
    address: string
  }
  onMessage?: (bookingId: string) => void
  onReschedule?: (bookingId: string, newDate: string, newTime: string) => void
}

export function EnhancedBookingCard({ booking, onMessage, onReschedule }: BookingCardProps) {
  const { toast } = useToast()
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "in-progress":
        return <RefreshCcw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleMessage = () => {
    setMessageModalOpen(true)
    if (onMessage) {
      onMessage(booking.id)
    }
  }

  const handleReschedule = (newDate: string, newTime: string) => {
    if (onReschedule) {
      onReschedule(booking.id, newDate, newTime)
    }
    toast({
      title: "Booking Rescheduled",
      description: `Your booking has been rescheduled to ${format(new Date(newDate), "PPP")} at ${newTime}.`,
    })
  }

  const canReschedule = ["pending", "confirmed"].includes(booking.status)
  const canMessage = !["cancelled"].includes(booking.status)

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex">
            {/* Service Image */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={booking.image}
                alt={booking.service}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Booking Details */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {booking.service}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">
                        {booking.provider.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{booking.provider}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{booking.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="ml-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(booking.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(booking.status)}
                    <span className="capitalize">{booking.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="font-semibold text-primary">
                  {booking.price.toLocaleString()} XAF
                </div>
                
                <div className="flex items-center gap-1">
                  {canMessage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMessage}
                      className="h-8 px-2 text-xs"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  )}
                  
                  {canReschedule && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRescheduleModalOpen(true)}
                      className="h-8 px-2 text-xs"
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Reschedule
                    </Button>
                  )}

                  {booking.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Rate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Message {booking.provider}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <WhatsAppChat 
              userRole="client" 
              preSelectedConversation="conv_001" 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <RescheduleModal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          booking={{
            id: booking.id,
            service: booking.service,
            provider: booking.provider,
            currentDate: booking.date,
            currentTime: booking.time,
          }}
          onReschedule={handleReschedule}
        />
      )}
    </>
  )
}