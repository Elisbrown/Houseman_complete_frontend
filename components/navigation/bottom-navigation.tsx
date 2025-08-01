"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/providers/i18n-provider"
import { Home, Search, Calendar, MessageCircle, User, Briefcase, BarChart3 } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: "client" | "provider" | "admin"
  unreadMessages?: number
}

export function BottomNavigation({ activeTab, onTabChange, userRole, unreadMessages = 0 }: BottomNavigationProps) {
  const { t } = useI18n()

  const getNavItems = () => {
    switch (userRole) {
      case "client":
        return [
          { id: "home", label: t("nav.home"), icon: Home },
          { id: "search", label: t("nav.search"), icon: Search },
          { id: "bookings", label: t("nav.bookings"), icon: Calendar },
          { id: "messages", label: t("nav.messages"), icon: MessageCircle, badge: unreadMessages },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      case "provider":
        return [
          { id: "home", label: t("nav.home"), icon: Home },
          { id: "services", label: t("nav.services"), icon: Briefcase },
          { id: "bookings", label: t("nav.bookings"), icon: Calendar },
          { id: "messages", label: t("nav.messages"), icon: MessageCircle, badge: unreadMessages },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      case "admin":
        return [
          { id: "dashboard", label: t("nav.dashboard"), icon: BarChart3 },
          { id: "users", label: t("nav.users"), icon: User },
          { id: "services", label: t("nav.services"), icon: Briefcase },
          { id: "messages", label: t("nav.messages"), icon: MessageCircle, badge: unreadMessages },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  // Don't show bottom navigation for admin on desktop
  if (userRole === "admin") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border md:hidden z-50 animate-slide-in-up">
      <div className="flex items-center justify-around py-2 safe-area-pb">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex-col h-auto py-2 px-3 relative transition-all duration-300 ${
                isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <div className="relative">
                <IconComponent className={`h-5 w-5 mb-1 transition-all duration-300 ${isActive ? "scale-110" : ""}`} />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-1 text-xs bg-red-500 text-white animate-pulse">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs transition-all duration-300 ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
