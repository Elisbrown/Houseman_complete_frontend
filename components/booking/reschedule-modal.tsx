"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

interface RescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  booking: {
    id: string
    service: string
    provider: string
    currentDate: string
    currentTime: string
  }
  onReschedule: (bookingId: string, newDate: string, newTime: string) => void
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00"
]

export function RescheduleModal({ isOpen, onClose, booking, onReschedule }: RescheduleModalProps) {
  const { toast } = useToast()
  
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const newDate = format(selectedDate, "yyyy-MM-dd")
      await onReschedule(booking.id, newDate, selectedTime)
      
      toast({
        title: "Booking Rescheduled!",
        description: `Your booking has been rescheduled to ${format(selectedDate, "PPP")} at ${selectedTime}.`,
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Reschedule Failed",
        description: "Failed to reschedule booking. Please try again.",
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Booking Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">{booking.service}</h3>
            <p className="text-sm text-muted-foreground">with {booking.provider}</p>
            <p className="text-sm font-medium mt-2">
              Current: {booking.currentDate} at {booking.currentTime}
            </p>
          </div>

          {/* New Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Select New Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Choose a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date: Date) => date < tomorrow}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* New Time Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Select New Time
            </Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={loading || !selectedDate || !selectedTime}
              className="flex-1"
            >
              {loading ? "Rescheduling..." : "Reschedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}