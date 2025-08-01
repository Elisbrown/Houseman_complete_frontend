"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EnhancedBookingCard } from "./enhanced-booking-card"
import { RescheduleModal } from "@/components/booking/reschedule-modal"
import { WhatsAppChat } from "@/components/chat/whatsapp-chat"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useBookings } from "@/hooks/use-bookings"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Star,
  MoreVertical,
  ArrowUpDown,
  SortAsc,
  SortDesc
} from "lucide-react"
import { format } from "date-fns"

type SortOption = "date" | "status" | "price" | "service"
type SortDirection = "asc" | "desc"

interface ComprehensiveBookingsPageProps {
  userRole: "client" | "provider"
}

export function ComprehensiveBookingsPage({ userRole }: ComprehensiveBookingsPageProps) {
  const { user } = useAuth()
  const { bookings, loading, refreshBookings } = useBookings(user?.id)
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  // Refresh bookings when component mounts
  useEffect(() => {
    refreshBookings()
  }, [refreshBookings])

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

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter(booking => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          booking.serviceId.toLowerCase().includes(query) ||
          booking.address.toLowerCase().includes(query) ||
          booking.status.toLowerCase().includes(query)
        )
      }
      return true
    })
    .filter(booking => {
      // Status filter
      if (statusFilter === "all") return true
      return booking.status === statusFilter
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.scheduledDate).getTime()
          bValue = new Date(b.scheduledDate).getTime()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "service":
          aValue = a.serviceId
          bValue = b.serviceId
          break
        default:
          return 0
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleMessage = (booking: any) => {
    setSelectedBooking(booking)
    setMessageModalOpen(true)
  }

  const handleReschedule = (booking: any) => {
    setSelectedBooking(booking)
    setRescheduleModalOpen(true)
  }

  const handleRescheduleConfirm = (bookingId: string, newDate: string, newTime: string) => {
    // Here you would call the API to update the booking
    toast({
      title: "Booking Rescheduled",
      description: `Your booking has been rescheduled to ${format(new Date(newDate), "PPP")} at ${newTime}.`,
    })
    refreshBookings()
  }

  const getStatusStats = () => {
    const stats = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      "in-progress": bookings.filter(b => b.status === "in-progress").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("all")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.all}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("pending")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("confirmed")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("in-progress")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats["in-progress"]}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("completed")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("cancelled")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
              {sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSortBy("date"); setSortDirection(sortDirection === "asc" ? "desc" : "asc") }}>
              Sort by Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("status"); setSortDirection(sortDirection === "asc" ? "desc" : "asc") }}>
              Sort by Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("price"); setSortDirection(sortDirection === "asc" ? "desc" : "asc") }}>
              Sort by Price
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("service"); setSortDirection(sortDirection === "asc" ? "desc" : "asc") }}>
              Sort by Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bookings List */}
      {filteredAndSortedBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold">No bookings found</p>
              <p className="text-muted-foreground">
                {statusFilter === "all" ? "You haven't made any bookings yet" : `No ${statusFilter} bookings found`}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedBookings.map((booking, index) => {
            // Transform booking data for EnhancedBookingCard
            const transformedBooking = {
              id: booking.id,
              service: "Service Name", // Would fetch from services
              provider: "Provider Name", // Would fetch from users
              date: booking.scheduledDate,
              time: booking.scheduledTime,
              status: booking.status as "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
              price: booking.price,
              image: "/placeholder.svg",
              address: booking.address,
            }

            return (
              <div
                key={booking.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EnhancedBookingCard
                  booking={transformedBooking}
                  onMessage={() => handleMessage(booking)}
                  onReschedule={() => handleReschedule(booking)}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Message Provider</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <WhatsAppChat 
              userRole={userRole} 
              preSelectedConversation="conv_001" 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      {selectedBooking && rescheduleModalOpen && (
        <RescheduleModal
          isOpen={rescheduleModalOpen}
          onClose={() => {
            setRescheduleModalOpen(false)
            setSelectedBooking(null)
          }}
          booking={{
            id: selectedBooking.id,
            service: "Service Name",
            provider: "Provider Name",
            currentDate: selectedBooking.scheduledDate,
            currentTime: selectedBooking.scheduledTime,
          }}
          onReschedule={handleRescheduleConfirm}
        />
      )}
    </div>
  )
}