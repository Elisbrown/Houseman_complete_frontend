"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchFiltersSidebar } from "./search-filters-sidebar"
import { BookingModal } from "@/components/booking/booking-modal"
import { useI18n } from "@/components/providers/i18n-provider"
import { useServices } from "@/hooks/use-services"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, X, MapPin, Star, Heart, MessageCircle, Phone } from "lucide-react"

interface EnhancedSearchWithApiProps {
  onServiceClick?: (serviceId: string) => void
  initialQuery?: string
  initialCategory?: string
}

export function EnhancedSearchWithApi({ 
  onServiceClick, 
  initialQuery = "", 
  initialCategory = "" 
}: EnhancedSearchWithApiProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({
    category: initialCategory || undefined,
  })
  const [isSearching, setIsSearching] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)

  // Use real API data
  const { services, loading } = useServices({
    category: activeFilters.category,
    query: searchQuery || undefined,
  })

  // Auto-search when initial values are provided
  useEffect(() => {
    if (initialQuery || initialCategory) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 500)
      return () => clearTimeout(timer)
    }
  }, [initialQuery, initialCategory])

  // Real-time search with debouncing
  const filteredServices = useMemo(() => {
    let filtered = services

    // Apply additional client-side filters
    if (activeFilters.location) {
      filtered = filtered.filter((service) =>
        service.serviceArea.address.toLowerCase().includes(activeFilters.location.toLowerCase())
      )
    }

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange
      filtered = filtered.filter((service) => service.price >= min && service.price <= max)
    }

    return filtered
  }, [services, activeFilters])

  const handleFilterChange = (newFilters: any) => {
    setActiveFilters({ ...activeFilters, ...newFilters })
  }

  const clearFilter = (filterKey: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[filterKey]
    setActiveFilters(newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setSearchQuery("")
  }

  const handleBookNow = (service: any) => {
    // Transform service data to match BookingModal interface
    const transformedService = {
      id: service.id,
      title: service.title,
      provider: "Provider", // We'd need to fetch provider details
      price: service.price,
      image: service.images[0] || "/placeholder.svg",
      category: service.category,
      location: service.serviceArea.address,
    }
    
    setSelectedService(transformedService)
    setBookingModalOpen(true)
    
    if (onServiceClick) {
      onServiceClick(service.id)
    }
  }

  const handleContactProvider = async (service: any) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id) {
        toast({
          title: "Login Required",
          description: "Please log in to contact providers.",
          variant: "destructive",
        })
        return
      }

      // Create conversation with provider (no booking restriction)
      const mockConversation = {
        id: `conv_${Date.now()}`,
        participantId: `provider_${service.id}`,
        participantName: `${service.title} Provider`,
        participantAvatar: service.images[0] || "/placeholder.svg",
        lastMessage: "Hi! I'm interested in your service...",
        timestamp: new Date().toISOString(),
        serviceId: service.id
      }
      
      // Store in localStorage for chat to pick up
      const existingConversations = JSON.parse(localStorage.getItem('mock_conversations') || '[]')
      
      // Check if conversation already exists with this provider
      const existingConv = existingConversations.find((conv: any) => 
        conv.participantId === mockConversation.participantId
      )
      
      if (!existingConv) {
        localStorage.setItem('mock_conversations', JSON.stringify([mockConversation, ...existingConversations]))
      }
      
      toast({
        title: "Chat Started",
        description: "Opening conversation with provider...",
      })
      
      // Navigate to messages tab in parent if available
      if (onServiceClick) {
        onServiceClick(service.id)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      toast({
        title: "Error",
        description: "Unable to start chat. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => activeFilters[key]).length
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {Array.isArray(value) ? value.join('-') : value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => clearFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Sidebar */}
      <SearchFiltersSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onApplyFilters={handleFilterChange}
        currentFilters={activeFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isSearching ? (
            "Searching..."
          ) : (
            `${filteredServices.length} ${filteredServices.length === 1 ? 'service' : 'services'} found`
          )}
        </p>
      </div>

      {/* Results Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold">No services found</p>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearAllFilters} className="mt-4">
                Clear all filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${showSidebar ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 transition-all duration-300`}>
          {filteredServices.map((service, index) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video relative">
                <img
                  src={service.images[0] || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {service.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent('Provider')}&background=6366f1&color=fff`} />
                    <AvatarFallback className="text-xs">P</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">4.8</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{service.serviceArea.address}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-bold text-primary">
                    {service.price.toLocaleString()} XAF
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactProvider(service)}
                      className="h-8 px-2"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBookNow(service)}
                      className="h-8 px-3"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false)
            setSelectedService(null)
          }}
          service={selectedService}
        />
      )}
    </div>
  )
}