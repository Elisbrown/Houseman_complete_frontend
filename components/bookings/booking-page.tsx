"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useI18n } from "@/components/providers/i18n-provider"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, MapPin, Star, Phone, MessageCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface BookingPageProps {
  service: {
    id: string
    title: string
    provider: string
    rating: number
    reviewCount: number
    price: number
    image: string
    isVerified: boolean
    category: string
    description: string
    location: string
  }
  onBack: () => void
}

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export function BookingPage({ service, onBack }: BookingPageProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !address.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    // Simulate booking API call
    setTimeout(() => {
      setIsBooking(false)
      setBookingConfirmed(true)
      toast({
        title: t("booking.bookingConfirmed"),
        description: "Your booking has been sent to the service provider.",
      })
    }, 2000)
  }

  const handleContactProvider = () => {
    console.log("Contact provider clicked")
    // Navigate to chat
  }

  const handleCallProvider = () => {
    console.log("Call provider clicked")
    // Initiate call
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                {t("booking.bookingConfirmed")}
              </h2>
              <p className="text-green-600 dark:text-green-400 mb-6">
                Your booking request has been sent to {service.provider}. They will contact you shortly to confirm the
                details.
              </p>

              <div className="space-y-3">
                <Button onClick={onBack} className="w-full">
                  Back to Services
                </Button>
                <Button variant="outline" onClick={handleContactProvider} className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Provider
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t("booking.bookingDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.service")}:</span>
                <span className="font-medium">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.provider")}:</span>
                <span className="font-medium">{service.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.date")}:</span>
                <span className="font-medium">{selectedDate && format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.time")}:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("booking.price")}:</span>
                <span className="font-semibold text-primary">
                  {service.price.toLocaleString()} {t("currency.xaf")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">{t("booking.bookNow")}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Service Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">{service.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">{service.provider}</span>
                  {service.isVerified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
                  </div>
                  <p className="font-semibold text-primary">
                    {service.price.toLocaleString()} {t("currency.xaf")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Contact */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {service.provider
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{service.provider}</p>
                  <p className="text-sm text-muted-foreground">{service.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCallProvider}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleContactProvider}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {t("booking.selectDate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("booking.selectTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("booking.address")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Service Address *</Label>
              <Input
                id="address"
                placeholder="Enter the address where service is needed"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>{t("booking.notes")}</CardTitle>
            <CardDescription>Any additional information for the service provider (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Special instructions, access codes, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t("booking.totalPrice")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>
                  {service.price.toLocaleString()} {t("currency.xaf")}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  {service.price.toLocaleString()} {t("currency.xaf")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={isBooking || !selectedDate || !selectedTime || !address.trim()}
          className="w-full h-12 text-lg"
        >
          {isBooking ? "Booking..." : t("booking.confirmBooking")}
        </Button>
      </div>
    </div>
  )
}
