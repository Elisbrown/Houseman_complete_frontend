import { useState, useEffect } from 'react'
import { api } from './use-api'
import { Wrench, Zap, Paintbrush, Scissors, Car, Sparkles, Home, Settings } from 'lucide-react'

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
}

// Map database categories to proper icons and colors
const getCategoryDisplay = (category: ServiceCategory) => {
  const iconMap: Record<string, any> = {
    cleaning: { icon: Sparkles, color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300" },
    electrical: { icon: Zap, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300" },
    plumbing: { icon: Wrench, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
    painting: { icon: Paintbrush, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
    carpentry: { icon: Home, color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300" },
    automotive: { icon: Car, color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" },
    beauty: { icon: Scissors, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
    appliance: { icon: Settings, color: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300" },
  }
  
  return iconMap[category.id] || { icon: Home, color: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300" }
}

export function useCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getCategoriesWithDisplay = () => {
    return categories.map(category => ({
      ...category,
      ...getCategoryDisplay(category)
    }))
  }

  return { categories: getCategoriesWithDisplay(), loading, error }
}