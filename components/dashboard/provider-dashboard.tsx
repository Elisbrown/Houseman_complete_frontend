"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { useServices } from "@/hooks/use-services"
import { useBookings } from "@/hooks/use-bookings"
import { useNotifications } from "@/hooks/use-notifications"
import { WhatsAppChat } from "@/components/chat/whatsapp-chat"
import { EnhancedProfileSettings } from "@/components/profile/enhanced-profile-settings"
import { SwipeNavigation } from "@/components/navigation/swipe-navigation"
import { ServiceModal } from "@/components/services/service-modal"
import { Plus, Star, Calendar, DollarSign, Users, TrendingUp, Clock, CheckCircle, Edit, Trash2, Eye, EyeOff } from "lucide-react"

export function ProviderDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [showServiceModal, setShowServiceModal] = useState(false)
  
  // Fetch provider's data using existing hooks
  const { services: providerServices, loading: servicesLoading } = useServices()
  const { bookings: providerBookings, loading: bookingsLoading, updateBooking } = useBookings(undefined, user?.id || "")
  const { notifications } = useNotifications(user?.id || "")
  
  // Filter services for current provider
  const myServices = providerServices.filter(service => service.providerId === user?.id)
  
  // Calculate real stats from data
  const stats = {
    monthlyRevenue: providerBookings
      .filter(booking => 
        booking.status === 'completed' && 
        new Date(booking.scheduledDate).getMonth() === new Date().getMonth()
      )
      .reduce((sum, booking) => sum + booking.price, 0),
    totalClients: new Set(providerBookings.map(booking => booking.clientId)).size,
    averageRating: 4.8, // TODO: Calculate from reviews
    completedBookings: providerBookings.filter(booking => booking.status === 'completed').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <Calendar className="h-4 w-4" />
      case "in-progress":
        return <TrendingUp className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      let newStatus = action
      if (action === 'accept') newStatus = 'confirmed'
      if (action === 'start') newStatus = 'in-progress'
      if (action === 'complete') newStatus = 'completed'
      
      await updateBooking(bookingId, { status: newStatus })
    } catch (error) {
      console.error('Failed to update booking:', error)
    }
  }

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
      })

      if (!response.ok) {
        throw new Error('Failed to update service status')
      }

      // Refresh the page to update the services list
      window.location.reload()
    } catch (error) {
      console.error('Failed to update service:', error)
    }
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="font-semibold">{stats.monthlyRevenue.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Clients</p>
                <p className="font-semibold">{stats.totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="font-semibold">{stats.averageRating} ⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="font-semibold">{stats.completedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="h-auto p-4 flex-col gap-2"
            onClick={() => setShowServiceModal(true)}
          >
            <Plus className="h-6 w-6" />
            <span>Add Service</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar className="h-6 w-6" />
            <span>View Bookings</span>
          </Button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setActiveTab('bookings')}
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {bookingsLoading ? (
            <div>Loading bookings...</div>
          ) : (
            providerBookings.slice(0, 3).map((booking) => (
              <Card key={booking.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">Client {booking.clientId}</h3>
                      <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </div>
                      </Badge>
                    </div>
                    <p className="font-semibold text-primary text-sm">{booking.price.toLocaleString()} XAF</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{booking.serviceId}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.scheduledDate} at {booking.scheduledTime}
                  </p>
                  {booking.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleBookingAction(booking.id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBookingAction(booking.id, 'cancelled')}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* KYC Verification */}
      {!user?.isVerified && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">Get Verified</CardTitle>
            <CardDescription className="text-blue-600">
              Complete your KYC verification to get the blue tick and build trust with clients.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Start Verification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Services</h2>
        <Button onClick={() => setShowServiceModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
      
      {servicesLoading ? (
        <div>Loading services...</div>
      ) : (
        <div className="grid gap-4">
          {myServices.map((service) => (
            <Card key={service.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                  <p className="font-semibold text-primary">{service.price.toLocaleString()} XAF</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id, !service.isActive)}
                  >
                    {service.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{service.category}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderBookingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Manage Bookings</h2>
      
      {bookingsLoading ? (
        <div>Loading bookings...</div>
      ) : (
        <div className="space-y-4">
          {providerBookings.map((booking) => (
            <Card key={booking.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Client {booking.clientId}</h3>
                  <Badge className={`${getStatusColor(booking.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </Badge>
                </div>
                <p className="font-semibold text-primary">{booking.price.toLocaleString()} XAF</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm"><strong>Service:</strong> {booking.serviceId}</p>
                <p className="text-sm"><strong>Date:</strong> {booking.scheduledDate} at {booking.scheduledTime}</p>
                <p className="text-sm"><strong>Address:</strong> {booking.address}</p>
                {booking.notes && (
                  <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>
                )}
              </div>

              <div className="flex gap-2">
                {booking.status === 'pending' && (
                  <>
                    <Button 
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'accept')}
                    >
                      Accept Booking
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBookingAction(booking.id, 'cancelled')}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <Button 
                    size="sm"
                    onClick={() => handleBookingAction(booking.id, 'start')}
                  >
                    Start Service
                  </Button>
                )}
                {booking.status === 'in-progress' && (
                  <Button 
                    size="sm"
                    onClick={() => handleBookingAction(booking.id, 'complete')}
                  >
                    Mark Complete
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab('messages')}
                >
                  Message Client
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderMessagesTab = () => (
    <WhatsAppChat userRole="provider" />
  )

  const renderProfileTab = () => (
    <EnhancedProfileSettings />
  )

  // Swipe navigation
  const tabOrder = ["home", "services", "bookings", "messages", "profile"]
  
  const handleSwipeLeft = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    const nextIndex = (currentIndex + 1) % tabOrder.length
    setActiveTab(tabOrder[nextIndex])
  }

  const handleSwipeRight = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    const prevIndex = currentIndex === 0 ? tabOrder.length - 1 : currentIndex - 1
    setActiveTab(tabOrder[prevIndex])
  }

  const handleServiceCreated = () => {
    // Refresh services when a new one is created
    window.location.reload() // Simple refresh for now
  }

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case "home":
          return renderHomeTab()
        case "services":
          return renderServicesTab()
        case "bookings":
          return renderBookingsTab()
        case "messages":
          return renderMessagesTab()
        case "profile":
          return renderProfileTab()
        default:
          return renderHomeTab()
      }
    })()

    return (
      <SwipeNavigation
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="min-h-[calc(100vh-8rem)]"
      >
        {content}
      </SwipeNavigation>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="main-content">
        {/* Header */}
        <div className="bg-primary text-white p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">Welcome back, {user?.firstName}!</h1>
              <p className="text-primary-foreground/80 text-sm">Manage your services and bookings</p>
            </div>
            <div className="flex items-center gap-2">
              {user?.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="p-4">
          {renderContent()}
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} userRole="provider" />
      
      {/* Service Modal */}
      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onServiceCreated={handleServiceCreated}
      />
    </div>
  )
}
