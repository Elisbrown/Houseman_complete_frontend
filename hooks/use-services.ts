import { useState, useEffect } from 'react'
import { api } from './use-api'
import type { Service } from '@/types/user'

export function useServices(filters?: {
  category?: string
  query?: string
  minPrice?: number
  maxPrice?: number
}) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params: Record<string, string> = {}
        if (filters?.category) params.category = filters.category
        if (filters?.query) params.q = filters.query
        if (filters?.minPrice) params.minPrice = filters.minPrice.toString()
        if (filters?.maxPrice) params.maxPrice = filters.maxPrice.toString()

        const data = await api.getServices(params)
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [filters?.category, filters?.query, filters?.minPrice, filters?.maxPrice])

  return { services, loading, error }
}

export function useService(id: string) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getService(id)
        setService(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch service')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchService()
    }
  }, [id])

  return { service, loading, error }
}