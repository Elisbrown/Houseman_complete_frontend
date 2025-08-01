"use client"

import { useEffect, useRef, useState } from "react"

interface SwipeNavigationProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
  threshold?: number
}

export function SwipeNavigation({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = "",
  threshold = 50 
}: SwipeNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState<number | null>(null)
  const [startY, setStartY] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startXPos: number | null = null
    let startYPos: number | null = null

    const handleTouchStart = (e: TouchEvent) => {
      startXPos = e.touches[0].clientX
      startYPos = e.touches[0].clientY
      setStartX(startXPos)
      setStartY(startYPos)
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!startXPos || !startYPos) return
      
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const deltaX = Math.abs(currentX - startXPos)
      const deltaY = Math.abs(currentY - startYPos)
      
      // If horizontal movement is greater than vertical, prevent default scrolling
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault()
        setIsDragging(true)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startXPos || !startYPos) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - startXPos
      const deltaY = endY - startYPos

      // Check if it's a horizontal swipe (more horizontal than vertical movement)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }

      setStartX(null)
      setStartY(null)
      setIsDragging(false)
    }

    // Mouse events for desktop testing
    const handleMouseDown = (e: MouseEvent) => {
      startXPos = e.clientX
      startYPos = e.clientY
      setStartX(startXPos)
      setStartY(startYPos)
      setIsDragging(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!startXPos || !startYPos) return
      
      const deltaX = Math.abs(e.clientX - startXPos)
      const deltaY = Math.abs(e.clientY - startYPos)
      
      if (deltaX > deltaY && deltaX > 10) {
        setIsDragging(true)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!startXPos || !startYPos) return

      const deltaX = e.clientX - startXPos
      const deltaY = e.clientY - startYPos

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }

      setStartX(null)
      setStartY(null)
      setIsDragging(false)
    }

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseup', handleMouseUp)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onSwipeLeft, onSwipeRight, threshold])

  return (
    <div 
      ref={containerRef} 
      className={`${className} ${isDragging ? 'select-none' : ''}`}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  )
}