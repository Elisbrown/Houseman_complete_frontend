"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchFilters } from "./search-filters"
import { ServiceCard } from "../services/service-card"
import { useI18n } from "@/components/providers/i18n-provider"
import { Search, Filter, X, MapPin, Star } from "lucide-react"

interface EnhancedSearchProps {
  onServiceClick: (serviceId: string) => void
  initialQuery?: string
  initialCategory?: string
}

const mockServices = [
  {
    id: "1",
    title: "Professional Home Cleaning & Disinfection",
    provider: "Marie Dubois",
    rating: 4.8,
    reviewCount: 124,
    price: 15000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: true,
    category: "Cleaning",
    location: "Yaoundé, Cameroon",
    distance: "2.5 km",
    description: "Complete home cleaning service with eco-friendly products",
    tags: ["cleaning", "disinfection", "home", "professional"],
  },
  {
    id: "2",
    title: "Electronic Device Repair & Maintenance",
    provider: "Jean Baptiste",
    rating: 4.9,
    reviewCount: 89,
    price: 8000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: true,
    category: "Electronics",
    location: "Douala, Cameroon",
    distance: "1.2 km",
    description: "Expert repair for phones, laptops, and home appliances",
    tags: ["electronics", "repair", "phones", "laptops", "appliances"],
  },
  {
    id: "3",
    title: "Interior & Exterior Painting Services",
    provider: "Paul Ngozi",
    rating: 4.7,
    reviewCount: 156,
    price: 45000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: false,
    category: "Painting",
    location: "Yaoundé, Cameroon",
    distance: "3.8 km",
    description: "Professional painting for homes and offices",
    tags: ["painting", "interior", "exterior", "decoration"],
  },
  {
    id: "4",
    title: "Professional Hair Cutting & Styling",
    provider: "Samuel Kone",
    rating: 4.6,
    reviewCount: 78,
    price: 5000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: true,
    category: "Barber",
    location: "Bamenda, Cameroon",
    distance: "0.8 km",
    description: "Modern haircuts and traditional styling",
    tags: ["barber", "haircut", "styling", "grooming"],
  },
  {
    id: "5",
    title: "Car Repair & Maintenance Services",
    provider: "Michel Fotso",
    rating: 4.5,
    reviewCount: 92,
    price: 25000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: true,
    category: "Mechanic",
    location: "Douala, Cameroon",
    distance: "4.2 km",
    description: "Complete automotive repair and maintenance",
    tags: ["mechanic", "car", "repair", "maintenance", "automotive"],
  },
  {
    id: "6",
    title: "Plumbing Installation & Repair",
    provider: "Andre Biya",
    rating: 4.4,
    reviewCount: 67,
    price: 12000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: false,
    category: "Plumber",
    location: "Yaoundé, Cameroon",
    distance: "2.1 km",
    description: "Professional plumbing services for homes and offices",
    tags: ["plumber", "plumbing", "installation", "repair", "pipes"],
  },
]

export function EnhancedSearch({ onServiceClick, initialQuery = "", initialCategory = "" }: EnhancedSearchProps) {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({
    category: initialCategory || undefined,
  })
  const [isSearching, setIsSearching] = useState(false)

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
    let filtered = mockServices

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.provider.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          service.location.toLowerCase().includes(query),
      )
    }

    // Apply filters
    if (activeFilters.category) {
      filtered = filtered.filter((service) => service.category.toLowerCase() === activeFilters.category.toLowerCase())
    }

    if (activeFilters.location) {
      filtered = filtered.filter((service) =>
        service.location.toLowerCase().includes(activeFilters.location.toLowerCase()),
      )
    }

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange
      filtered = filtered.filter((service) => service.price >= min && service.price <= max)
    }

    if (activeFilters.rating) {
      filtered = filtered.filter((service) => service.rating >= activeFilters.rating)
    }

    // Sort results
    if (activeFilters.sortBy) {
      switch (activeFilters.sortBy) {
        case "price_low":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price_high":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case "distance":
          filtered.sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
          break
        default:
          // Keep original order for relevance
          break
      }
    }

    return filtered
  }, [searchQuery, activeFilters])

  // Simulate search loading
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 300)
      return () => clearTimeout(timer)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters)
    setShowFilters(false)
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

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length + (searchQuery.trim() ? 1 : 0)
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="space-y-4 animate-slide-in-up">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("services.searchServices")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="relative transition-all duration-300 hover:scale-105"
            >
              <Filter className="h-4 w-4" />
              {getActiveFilterCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-1 text-xs animate-pulse">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(Object.keys(activeFilters).length > 0 || searchQuery.trim()) && (
          <div className="flex flex-wrap gap-2 items-center animate-slide-in-up delay-100">
            <span className="text-sm text-muted-foreground">{t("common.activeFilters")}:</span>

            {searchQuery.trim() && (
              <Badge variant="secondary" className="gap-1 animate-fade-in">
                Search: "{searchQuery}"
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchQuery("")}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.category && (
              <Badge variant="secondary" className="gap-1 animate-fade-in delay-100">
                Category: {activeFilters.category}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearFilter("category")}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.location && (
              <Badge variant="secondary" className="gap-1 animate-fade-in delay-200">
                <MapPin className="h-3 w-3" />
                {activeFilters.location}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearFilter("location")}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.rating && (
              <Badge variant="secondary" className="gap-1 animate-fade-in delay-300">
                <Star className="h-3 w-3" />
                {activeFilters.rating}+ rating
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearFilter("rating")}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.priceRange && (
              <Badge variant="secondary" className="gap-1 animate-fade-in delay-400">
                {activeFilters.priceRange[0].toLocaleString()} - {activeFilters.priceRange[1].toLocaleString()} XAF
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearFilter("priceRange")}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Search Filters */}
      {showFilters && (
        <div className="animate-slide-in-down">
          <SearchFilters
            onClose={() => setShowFilters(false)}
            onApplyFilters={handleApplyFilters}
            currentFilters={activeFilters}
          />
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {/* Results Header */}
        <div className="flex items-center justify-between animate-slide-in-up delay-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              {isSearching ? t("common.searching") : `${filteredServices.length} ${t("common.servicesFound")}`}
            </h2>
            {searchQuery.trim() && <span className="text-sm text-muted-foreground">for "{searchQuery}"</span>}
          </div>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg loading-shimmer"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4 loading-shimmer"></div>
                      <div className="h-3 bg-muted rounded w-1/2 loading-shimmer"></div>
                      <div className="h-3 bg-muted rounded w-1/4 loading-shimmer"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!isSearching && (
          <>
            {filteredServices.length > 0 ? (
              <div className="space-y-3">
                {filteredServices.map((service, index) => (
                  <div key={service.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <ServiceCard service={service} onClick={() => onServiceClick(service.id)} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("common.noServicesFound")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery.trim()
                      ? `${t("common.noServicesMatch")} "${searchQuery}". ${t("common.tryAdjusting")}`
                      : `${t("common.noServicesMatchFilters")} ${t("common.tryAdjusting")}`}
                  </p>
                  <Button onClick={clearAllFilters} variant="outline" className="hover:bg-primary/10">
                    {t("common.clearAllFilters")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
