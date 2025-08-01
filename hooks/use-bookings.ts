import { useState, useEffect, useCallback } from 'react'
import { api } from './use-api'
import type { Booking } from '@/types/user'

export function useBookings(clientId?: string, providerId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: Record<string, string> = {}
      if (clientId) params.clientId = clientId
      if (providerId) params.providerId = providerId

      const data = await api.getBookings(params)
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [clientId, providerId])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const createBooking = async (bookingData: any) => {
    try {
      const newBooking = await api.createBooking(bookingData)
      setBookings(prev => [newBooking, ...prev])
      return newBooking
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create booking')
    }
  }

  const updateBooking = async (id: string, updates: any) => {
    try {
      const updatedBooking = await api.updateBooking(id, updates)
      setBookings(prev => prev.map(booking => 
        booking.id === id ? updatedBooking : booking
      ))
      return updatedBooking
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update booking')
    }
  }

  const refreshBookings = useCallback(() => {
    fetchBookings()
  }, [fetchBookings])

  return { bookings, loading, error, createBooking, updateBooking, refreshBookings }
}