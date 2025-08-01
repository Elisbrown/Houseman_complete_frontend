"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Image as ImageIcon, File, Camera } from "lucide-react"

interface ImageUploadProps {
  onUpload: (file: File, url: string) => void
  maxSize?: number // in MB
  accept?: string
  multiple?: boolean
  className?: string
}

interface UploadedFile {
  file: File
  url: string
  preview: string
}

export function ImageUpload({ 
  onUpload, 
  maxSize = 5, 
  accept = "image/*", 
  multiple = false,
  className = ""
}: ImageUploadProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File size must be less than ${maxSize}MB`,
          variant: "destructive",
        })
        return false
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return false
      }

      return true
    })

    validFiles.forEach(file => uploadFile(file))
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    
    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate a mock URL for the uploaded file
      const fileName = `${Date.now()}_${file.name}`
      const mockUrl = `/uploads/${fileName}`
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      
      const uploadedFile: UploadedFile = {
        file,
        url: mockUrl,
        preview: previewUrl
      }

      setUploadedFiles(prev => [...prev, uploadedFile])
      onUpload(file, mockUrl)

      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully.",
      })

      // Save to localStorage for persistence (in real app would save to server)
      const existingUploads = JSON.parse(localStorage.getItem('uploaded_files') || '[]')
      existingUploads.push({
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: mockUrl,
        uploadedAt: new Date().toISOString()
      })
      localStorage.setItem('uploaded_files', JSON.stringify(existingUploads))

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const openPreview = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setPreviewOpen(true)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`transition-all duration-200 ${
          isDragging 
            ? 'border-primary border-2 bg-primary/5' 
            : 'border-dashed border-2 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium">
                {uploading ? "Uploading..." : "Drop images here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              
              <Button
                onClick={() => {
                  // In a real app, this would open camera
                  fileInputRef.current?.click()
                }}
                disabled={uploading}
                variant="outline"
              >
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedFiles.map((uploadedFile, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative">
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover rounded cursor-pointer"
                    onClick={() => openPreview(uploadedFile.preview)}
                  />
                  
                  {/* Remove button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}