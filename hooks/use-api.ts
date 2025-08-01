import { useState, useEffect } from 'react'

// Custom hook for API calls
export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(url, options)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error, refetch: () => fetchData() }
}

// API helper functions
export const api = {
  // Services
  getServices: (params?: Record<string, string>) => {
    const url = new URL('/api/services', window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    return fetch(url.toString()).then(res => res.json())
  },

  getService: (id: string) => 
    fetch(`/api/services/${id}`).then(res => res.json()),

  createService: (data: any) =>
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateService: (id: string, data: any) =>
    fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // Bookings
  getBookings: (params?: Record<string, string>) => {
    const url = new URL('/api/bookings', window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    return fetch(url.toString()).then(res => res.json())
  },

  createBooking: (data: any) =>
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateBooking: (id: string, data: any) =>
    fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // Messages
  getMessages: (conversationId: string) =>
    fetch(`/api/messages?conversationId=${conversationId}`).then(res => res.json()),

  sendMessage: (data: any) =>
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  getConversations: (userId: string) =>
    fetch(`/api/conversations?userId=${userId}`).then(res => res.json()),

  // Reviews
  getReviews: (providerId?: string) => {
    const url = providerId ? `/api/reviews?providerId=${providerId}` : '/api/reviews'
    return fetch(url).then(res => res.json())
  },

  createReview: (data: any) =>
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // Notifications
  getNotifications: (userId: string) =>
    fetch(`/api/notifications?userId=${userId}`).then(res => res.json()),

  markNotificationAsRead: (notificationId: string) =>
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId }),
    }).then(res => res.json()),

  // Users
  getUsers: (role?: string) => {
    const url = role ? `/api/users?role=${role}` : '/api/users'
    return fetch(url).then(res => res.json())
  },

  getUser: (id: string) =>
    fetch(`/api/users/${id}`).then(res => res.json()),

  updateUser: (id: string, data: any) =>
    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // Categories
  getCategories: () =>
    fetch('/api/categories').then(res => res.json()),

  // Analytics
  getAnalytics: () =>
    fetch('/api/analytics').then(res => res.json()),
}