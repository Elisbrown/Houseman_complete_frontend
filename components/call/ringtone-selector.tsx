"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useI18n } from "@/components/providers/i18n-provider"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

interface RingtoneSelectorProps {
  onClose: () => void
}

const ringtones = [
  { id: "classic", name: "Classic Ring", file: "/sounds/classic-ring.mp3" },
  { id: "digital", name: "Digital", file: "/sounds/digital.mp3" },
  { id: "marimba", name: "Marimba", file: "/sounds/marimba.mp3" },
  { id: "chime", name: "Chime", file: "/sounds/chime.mp3" },
  { id: "bell", name: "Bell", file: "/sounds/bell.mp3" },
]

export function RingtoneSelector({ onClose }: RingtoneSelectorProps) {
  const { t } = useI18n()
  const [selectedRingtone, setSelectedRingtone] = useState("classic")
  const [volume, setVolume] = useState(80)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    const selectedTone = ringtones.find((r) => r.id === selectedRingtone)
    if (selectedTone) {
      const newAudio = new Audio(selectedTone.file)
      newAudio.volume = volume / 100
      newAudio.loop = true
      setAudio(newAudio)
    }

    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [selectedRingtone])

  // Update volume when it changes
  useEffect(() => {
    if (audio) {
      audio.volume = volume / 100
    }
  }, [volume, audio])

  const handleRingtoneChange = (value: string) => {
    if (isPlaying && audio) {
      audio.pause()
      audio.currentTime = 0
    }

    setSelectedRingtone(value)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0
    } else {
      audio.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem("ringtone_preference", selectedRingtone)
    localStorage.setItem("ringtone_volume", volume.toString())

    if (isPlaying && audio) {
      audio.pause()
      audio.currentTime = 0
    }

    onClose()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringtone Settings</CardTitle>
        <CardDescription>Choose your preferred ringtone and volume</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Select Ringtone</h3>
            <Button variant="outline" size="sm" onClick={togglePlay} className="flex items-center gap-1">
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>Preview</span>
                </>
              )}
            </Button>
          </div>

          <RadioGroup value={selectedRingtone} onValueChange={handleRingtoneChange} className="space-y-2">
            {ringtones.map((ringtone) => (
              <div key={ringtone.id} className="flex items-center space-x-2">
                <RadioGroupItem value={ringtone.id} id={ringtone.id} />
                <Label htmlFor={ringtone.id} className="cursor-pointer">
                  {ringtone.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Volume</h3>
            <span className="text-sm text-muted-foreground">{volume}%</span>
          </div>

          <div className="flex items-center gap-4">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={5}
              onValueChange={(values) => setVolume(values[0])}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}
