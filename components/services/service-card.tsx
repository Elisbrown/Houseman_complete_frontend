"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/providers/i18n-provider"
import { Star, MapPin } from "lucide-react"

interface ServiceCardProps {
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
    location?: string
    distance?: string
  }
  onClick: () => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const { t } = useI18n()

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    onClick() // Trigger the parent's onClick (which will open booking modal)
  }

  const handleProviderClick = () => {
    console.log("Provider clicked:", service.provider)
    // Navigate to provider profile
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
            <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-medium text-sm truncate pr-2">{service.title}</h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {service.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleProviderClick()
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {service.provider}
              </button>
              {service.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {service.location && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{service.location}</span>
                {service.distance && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{service.distance}</span>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{service.rating}</span>
                <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary text-sm">
                  {service.price.toLocaleString()} {t("currency.xaf")}
                </p>
                <Button
                  size="sm"
                  onClick={handleBookNow}
                  className="text-xs px-3 py-1 h-7"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
