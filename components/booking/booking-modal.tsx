"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/components/providers/auth-provider"
import { useBookings } from "@/hooks/use-bookings"
import { useToast } from "@/hooks/use-toast"
import { Calendar as CalendarIcon, Clock, MapPin, User, Phone, CreditCard } from "lucide-react"
import { format } from "date-fns"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    id: string
    title: string
    provider: string
    price: number
    image: string
    category: string
    location: string
  }
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00"
]

export function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const { user } = useAuth()
  const { createBooking } = useBookings()
  const { toast } = useToast()
  
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [contactPhone, setContactPhone] = useState(user?.phone || "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.phone) {
      setContactPhone(user.phone)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service.",
        variant: "destructive",
      })
      return
    }

    if (!selectedDate || !selectedTime || !address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const booking = await createBooking({
        clientId: user.id,
        providerId: "provider_001", // This should be dynamic - get from service data
        serviceId: service.id,
        status: "pending",
        scheduledDate: format(selectedDate, "yyyy-MM-dd"),
        scheduledTime: selectedTime,
        address: address.trim(),
        notes: notes.trim(),
        price: service.price,
        currency: "XAF",
      })

      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${service.title} has been submitted successfully. Check your bookings page to track the status.`,
      })

      // Reset form
      setSelectedDate(undefined)
      setSelectedTime("")
      setAddress("")
      setNotes("")
      
      onClose()
      
      // Refresh the page or trigger a refresh of bookings
      window.location.reload()
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book Service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {service.provider}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {service.location}
                  </p>
                  <p className="font-semibold text-lg text-primary flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {service.price.toLocaleString()} XAF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Select Date *
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                min={format(tomorrow, "yyyy-MM-dd")}
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(new Date(e.target.value))
                  } else {
                    setSelectedDate(undefined)
                  }
                }}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Select Time *
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-sm"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Service Address *
            </Label>
            <Textarea
              id="address"
              placeholder="Enter the full address where the service should be performed..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Contact Phone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+237 6XX XXX XXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime || !address.trim()}
              className="flex-1"
            >
              {loading ? "Booking..." : `Book for ${service.price.toLocaleString()} XAF`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}