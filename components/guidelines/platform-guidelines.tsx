"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/components/providers/i18n-provider"
import { Shield, AlertTriangle, Check, X, ChevronDown, ChevronUp } from "lucide-react"

interface PlatformGuidelinesProps {
  onClose?: () => void
}

export function PlatformGuidelines({ onClose }: PlatformGuidelinesProps) {
  const { t } = useI18n()
  const [expandedSection, setExpandedSection] = useState<string | null>("safety")

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <Card className="animate-slide-in-up">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <CardTitle>Platform Usage Guidelines</CardTitle>
        </div>
        <CardDescription className="text-primary-foreground/80">
          For your safety and the best experience on Houseman
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Safety Guidelines */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-2 hover:bg-muted"
            onClick={() => toggleSection("safety")}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">Safety Guidelines</span>
            </div>
            {expandedSection === "safety" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSection === "safety" && (
            <div className="p-3 bg-muted/50 rounded-md space-y-3 animate-fade-in">
              <p className="text-sm">
                Your safety is our priority. Follow these guidelines to ensure a secure experience:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep all communication within the Houseman platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Make all payments through our secure payment system</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Verify service provider identity before allowing them into your home</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Report suspicious behavior immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Never share personal financial information</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid making payments outside the platform</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Separator />

        {/* Communication Guidelines */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-2 hover:bg-muted"
            onClick={() => toggleSection("communication")}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Communication Guidelines</span>
            </div>
            {expandedSection === "communication" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {expandedSection === "communication" && (
            <div className="p-3 bg-muted/50 rounded-md space-y-3 animate-fade-in">
              <p className="text-sm">Proper communication ensures a smooth service experience:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Be clear about your service requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respond promptly to messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate location information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Discuss any changes to the service scope before work begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't share contact information to communicate outside the platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid using offensive or inappropriate language</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Separator />

        {/* Payment Guidelines */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-2 hover:bg-muted"
            onClick={() => toggleSection("payment")}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Payment Guidelines</span>
            </div>
            {expandedSection === "payment" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSection === "payment" && (
            <div className="p-3 bg-muted/50 rounded-md space-y-3 animate-fade-in">
              <p className="text-sm">Follow these payment guidelines to avoid scams and ensure fair transactions:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Only pay through the Houseman platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Confirm the final price before confirming the booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Report any payment issues to customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Never pay in cash or through external payment methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't agree to additional charges not listed in the service description</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Report any provider who requests payment outside the platform</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Separator />

        {/* Reporting Guidelines */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-2 hover:bg-muted"
            onClick={() => toggleSection("reporting")}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">Reporting Guidelines</span>
            </div>
            {expandedSection === "reporting" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSection === "reporting" && (
            <div className="p-3 bg-muted/50 rounded-md space-y-3 animate-fade-in">
              <p className="text-sm">Help us maintain a safe platform by reporting:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Requests for payment outside the platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Inappropriate behavior or harassment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Services not performed as described</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Suspicious activity or potential scams</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Leave honest reviews after service completion</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end p-4 pt-0">
        <Button onClick={onClose}>I Understand</Button>
      </CardFooter>
    </Card>
  )
}
