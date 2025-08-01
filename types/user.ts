export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "client" | "provider" | "admin"
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string

  // Provider-specific fields
  services?: Service[]
  rating?: number
  reviewCount?: number
  kycStatus?: "pending" | "approved" | "rejected"

  // Client-specific fields
  location?: {
    address: string
    latitude: number
    longitude: number
  }
}

export interface Service {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  currency: "XAF"
  images: string[]
  availability: string[]
  serviceArea: {
    address: string
    radius: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  clientId: string
  providerId: string
  serviceId: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  scheduledDate: string
  scheduledTime: string
  address: string
  notes?: string
  price: number
  currency: "XAF"
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  bookingId: string
  clientId: string
  providerId: string
  rating: number
  comment: string
  createdAt: string
}
