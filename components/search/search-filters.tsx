"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/providers/i18n-provider"
import { X, MapPin, Star } from "lucide-react"

interface SearchFiltersProps {
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters?: FilterOptions
}

interface FilterOptions {
  category?: string
  location?: string
  priceRange: [number, number]
  rating?: number
  availability?: string
  sortBy?: string
}

const categories = ["carpenter", "electrician", "painter", "barber", "mechanic", "cleaner", "plumber", "gardener"]

const locations = ["Yaoundé", "Douala", "Bamenda", "Bafoussam", "Garoua", "Maroua"]

const availabilityOptions = ["today", "tomorrow", "this_week", "next_week", "flexible"]

const sortOptions = ["relevance", "price_low", "price_high", "rating", "distance"]

export function SearchFilters({ onClose, onApplyFilters, currentFilters = {} }: SearchFiltersProps) {
  const { t } = useI18n()
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100000],
    ...currentFilters,
  })

  const handleApply = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    setFilters({
      priceRange: [0, 100000],
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{t("services.filterBy")}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>{t("services.category")}</Label>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t("common.select")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`services.${category}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t("services.location")}
          </Label>
          <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t("common.select")} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label>{t("services.priceRange")}</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {filters.priceRange[0].toLocaleString()} {t("currency.xaf")}
            </span>
            <span>
              {filters.priceRange[1].toLocaleString()} {t("currency.xaf")}
            </span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            {t("services.rating")}
          </Label>
          <div className="flex gap-2">
            {[4, 4.5, 5].map((rating) => (
              <Badge
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilters({ ...filters, rating })}
              >
                {rating}+ ⭐
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <Label>{t("services.availability")}</Label>
          <Select
            value={filters.availability}
            onValueChange={(value) => setFilters({ ...filters, availability: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("common.select")} />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>{t("services.sortBy")}</Label>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t("services.relevance")} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`services.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            {t("common.reset")}
          </Button>
          <Button onClick={handleApply} className="flex-1">
            {t("common.apply")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
