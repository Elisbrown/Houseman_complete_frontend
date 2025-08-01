"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useCategories } from "@/hooks/use-categories"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import type { Service } from "@/types/user"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceCreated?: (service: Service) => void
  service?: Service // For editing existing service
}

export function ServiceModal({ isOpen, onClose, onServiceCreated, service }: ServiceModalProps) {
  const { user } = useAuth()
  const { categories } = useCategories()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    category: service?.category || "",
    price: service?.price?.toString() || "",
    availability: service?.availability?.join(", ") || "Monday-Friday, 9AM-5PM",
    serviceArea: service?.serviceArea?.address || "",
    radius: service?.serviceArea?.radius?.toString() || "10",
    images: service?.images || []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>(formData.images)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // For demo purposes, we'll use placeholder URLs
      // In a real app, you'd upload to a service like Cloudinary
      const newImages = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-${Date.now()}-${index}?w=400&h=300&fit=crop`
      )
      
      setImagePreview(prev => [...prev, ...newImages])
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImages] 
      }))
    }
  }

  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a service",
        variant: "destructive"
      })
      return
    }

    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const serviceData = {
        providerId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseInt(formData.price),
        currency: "XAF" as const,
        images: formData.images.length > 0 ? formData.images : [
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop"
        ],
        availability: formData.availability.split(",").map(s => s.trim()),
        serviceArea: {
          address: formData.serviceArea || "Yaoundé, Cameroon",
          radius: parseInt(formData.radius) || 10
        },
        isActive: true
      }

      const response = await fetch('/api/services', {
        method: service ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service ? { id: service.id, ...serviceData } : serviceData)
      })

      if (!response.ok) {
        throw new Error('Failed to save service')
      }

      const savedService = await response.json()
      
      toast({
        title: "Success!",
        description: `Service ${service ? 'updated' : 'created'} successfully`,
      })

      onServiceCreated?.(savedService)
      onClose()
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        availability: "Monday-Friday, 9AM-5PM",
        serviceArea: "",
        radius: "10",
        images: []
      })
      setImagePreview([])
      
    } catch (error) {
      console.error('Error saving service:', error)
      toast({
        title: "Error",
        description: `Failed to ${service ? 'update' : 'create'} service. Please try again.`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Create New Service'}</DialogTitle>
          <DialogDescription>
            {service ? 'Update your service details' : 'Add a new service to your offerings'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Professional House Cleaning"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your service in detail..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const categoryName = typeof category === 'string' ? category : category.name || category.id || String(category)
                      const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
                      return (
                        <SelectItem key={categoryName} value={categoryName}>
                          {displayName}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (XAF) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="15000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Service Area */}
          <div className="space-y-4">
            <h3 className="font-semibold">Service Area</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceArea">Address/Location</Label>
                <Input
                  id="serviceArea"
                  value={formData.serviceArea}
                  onChange={(e) => handleInputChange("serviceArea", e.target.value)}
                  placeholder="Yaoundé, Cameroon"
                />
              </div>

              <div>
                <Label htmlFor="radius">Service Radius (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={formData.radius}
                  onChange={(e) => handleInputChange("radius", e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) => handleInputChange("availability", e.target.value)}
              placeholder="Monday-Friday, 9AM-5PM"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple time slots with commas
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Service Images</Label>
            
            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imagePreview.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Service image ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload service images
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}