"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Star, MapPin, DollarSign, Clock } from "lucide-react"

interface SearchFiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  currentFilters: any
}

const categories = [
  "cleaning", "plumbing", "electrical", "carpentry", "painting", 
  "gardening", "automotive", "tutoring", "beauty", "catering"
]

const locations = [
  "Yaoundé", "Douala", "Bamenda", "Bafoussam", "Garoua", 
  "Maroua", "Ngaoundéré", "Bertoua", "Ebolowa", "Kribi"
]

const ratings = [
  { value: 4.5, label: "4.5+ stars" },
  { value: 4.0, label: "4.0+ stars" },
  { value: 3.5, label: "3.5+ stars" },
  { value: 3.0, label: "3.0+ stars" },
]

const availability = [
  "today", "tomorrow", "this-week", "next-week", "anytime"
]

export function SearchFiltersSidebar({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}: SearchFiltersSidebarProps) {
  const [tempFilters, setTempFilters] = useState(currentFilters)

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...tempFilters, [key]: value }
    setTempFilters(newFilters)
    // Auto-apply filters immediately
    onApplyFilters(newFilters)
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...tempFilters }
    delete newFilters[key]
    setTempFilters(newFilters)
    // Auto-apply filters immediately
    onApplyFilters(newFilters)
  }

  const clearAllFilters = () => {
    setTempFilters({})
    // Auto-apply filters immediately
    onApplyFilters({})
  }

  const applyFilters = () => {
    onApplyFilters(tempFilters)
    onClose()
  }

  const getActiveFilterCount = () => {
    return Object.keys(tempFilters).filter(key => tempFilters[key]).length
  }

  if (!isOpen) return null

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:transform-none
        overflow-y-auto
      `}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary">{getActiveFilterCount()}</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Active Filters</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-xs h-6 px-2"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(tempFilters).map(([key, value]) => {
                  if (!value) return null
                  
                  // Convert value to string for display
                  const displayValue = Array.isArray(value) 
                    ? value.join('-') 
                    : typeof value === 'object' 
                      ? JSON.stringify(value)
                      : String(value)
                  
                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {key}: {displayValue}
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
              </div>
            </div>
          )}

          {/* Category Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select 
                value={tempFilters.category || "all"} 
                onValueChange={(value) => updateFilter("category", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Location Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select 
                value={tempFilters.location || "all"} 
                onValueChange={(value) => updateFilter("location", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Price Range Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range (XAF)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="px-2">
                <Slider
                  value={tempFilters.priceRange || [0, 100000]}
                  onValueChange={(value) => updateFilter("priceRange", value)}
                  max={100000}
                  step={5000}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{(tempFilters.priceRange?.[0] || 0).toLocaleString()} XAF</span>
                <span>{(tempFilters.priceRange?.[1] || 100000).toLocaleString()} XAF</span>
              </div>
            </CardContent>
          </Card>

          {/* Rating Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating.value}`}
                    checked={tempFilters.rating === rating.value}
                    onCheckedChange={(checked) => 
                      updateFilter("rating", checked ? rating.value : null)
                    }
                  />
                  <Label 
                    htmlFor={`rating-${rating.value}`} 
                    className="text-sm flex items-center gap-1"
                  >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {rating.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Availability Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select 
                value={tempFilters.availability || "all"} 
                onValueChange={(value) => updateFilter("availability", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This week</SelectItem>
                  <SelectItem value="next-week">Next week</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={clearAllFilters} 
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}