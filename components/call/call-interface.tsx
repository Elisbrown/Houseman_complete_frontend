"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { RingtoneSelector } from "./ringtone-selector"
import { useI18n } from "@/components/providers/i18n-provider"
import { useToast } from "@/hooks/use-toast"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageCircle, UserPlus, Settings } from "lucide-react"

interface CallInterfaceProps {
  contact: {
    id: string
    name: string
    avatar?: string
    isVerified?: boolean
    isOfficial?: boolean
  }
  onEndCall: () => void
  callType: "incoming" | "outgoing"
}

export function CallInterface({ contact, onEndCall, callType }: CallInterfaceProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">(
    callType === "incoming" ? "ringing" : "connected",
  )
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isOnHold, setIsOnHold] = useState(false)
  const [showRingtoneSettings, setShowRingtoneSettings] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Initialize ringtone
  useEffect(() => {
    const savedRingtone = localStorage.getItem("ringtone_preference") || "classic"
    const savedVolume = Number.parseInt(localStorage.getItem("ringtone_volume") || "80")

    const ringtonePath = `/sounds/${savedRingtone}.mp3`
    const newAudio = new Audio(ringtonePath)
    newAudio.volume = savedVolume / 100
    newAudio.loop = true

    if (callType === "incoming") {
      newAudio.play()
    }

    setAudio(newAudio)

    return () => {
      newAudio.pause()
      newAudio.currentTime = 0
    }
  }, [callType])

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  // Auto-answer for demo (in real app, user would answer)
  useEffect(() => {
    if (callType === "outgoing") {
      const timer = setTimeout(() => {
        setCallStatus("connected")
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
        toast({
          title: "Call connected",
          description: `Connected to ${contact.name}`,
        })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [callType, contact.name, toast, audio])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = () => {
    setCallStatus("connected")
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    toast({
      title: "Call answered",
      description: `Connected to ${contact.name}`,
    })
  }

  const handleEndCall = () => {
    setCallStatus("ended")
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    toast({
      title: "Call ended",
      description: `Call with ${contact.name} ended`,
    })
    setTimeout(onEndCall, 1000)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
    toast({
      title: isMuted ? "Microphone on" : "Microphone muted",
      description: isMuted ? "You can now speak" : "Your microphone is muted",
    })
  }

  const handleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    toast({
      title: isSpeakerOn ? "Speaker off" : "Speaker on",
      description: isSpeakerOn ? "Audio through earpiece" : "Audio through speaker",
    })
  }

  const handleHold = () => {
    setIsOnHold(!isOnHold)
    toast({
      title: isOnHold ? "Call resumed" : "Call on hold",
      description: isOnHold ? "Call resumed" : "Call placed on hold",
    })
  }

  const handleMessage = () => {
    toast({
      title: "Opening chat",
      description: "Switching to chat interface",
    })
  }

  const getVerificationBadge = () => {
    if (contact.isOfficial) {
      return (
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )
    } else if (contact.isVerified) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )
    }
    return null
  }

  const getCallStatusText = () => {
    switch (callStatus) {
      case "ringing":
        return callType === "incoming" ? "Incoming call..." : "Calling..."
      case "connected":
        return isOnHold ? "On hold" : formatDuration(callDuration)
      case "ended":
        return "Call ended"
      default:
        return ""
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background z-50 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32 animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-48 h-48 bg-white rounded-full translate-x-24 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white rounded-full translate-y-16 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {callType === "incoming" ? "Incoming" : "Outgoing"}
          </Badge>
          {callStatus === "connected" && (
            <Badge className="bg-green-100 text-green-800 text-xs animate-pulse">Connected</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowRingtoneSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Contact Info */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="text-center space-y-6 animate-fade-in">
          {/* Avatar */}
          <div className="relative">
            <Avatar className={`h-32 w-32 ring-4 ring-white/20 ${callStatus === "connected" ? "animate-pulse" : ""}`}>
              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl bg-primary/20">
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {getVerificationBadge() && <div className="absolute -bottom-2 -right-2">{getVerificationBadge()}</div>}
          </div>

          {/* Name */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{contact.name}</h1>
            <p className="text-muted-foreground mt-1">{getCallStatusText()}</p>
          </div>

          {/* Call Status Animation */}
          {callStatus === "ringing" && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="p-6 relative z-10">
        {callStatus === "ringing" && callType === "incoming" ? (
          /* Incoming Call Controls */
          <div className="flex justify-center gap-8">
            <Button size="lg" variant="destructive" className="h-16 w-16 rounded-full" onClick={handleEndCall}>
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button size="lg" className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600" onClick={handleAnswer}>
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          /* Active Call Controls */
          <div className="space-y-6">
            {/* Secondary Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={handleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              <Button
                variant={isSpeakerOn ? "default" : "outline"}
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={handleSpeaker}
              >
                {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>

              <Button variant="outline" size="lg" className="h-12 w-12 rounded-full" onClick={handleMessage}>
                <MessageCircle className="h-5 w-5" />
              </Button>

              <Button
                variant={isOnHold ? "default" : "outline"}
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={handleHold}
              >
                <UserPlus className="h-5 w-5" />
              </Button>
            </div>

            {/* End Call */}
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full hover:scale-110 transition-transform duration-200"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Platform Guidelines */}
      {callStatus === "connected" && (
        <div className="absolute bottom-20 left-4 right-4">
          <Card className="bg-yellow-50 border-yellow-200 animate-slide-in-up">
            <CardContent className="p-3">
              <p className="text-xs text-yellow-800 text-center">💡 {t("call.platformGuideline")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ringtone Settings Dialog */}
      <Dialog open={showRingtoneSettings} onOpenChange={setShowRingtoneSettings}>
        <DialogContent>
          <RingtoneSelector onClose={() => setShowRingtoneSettings(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
