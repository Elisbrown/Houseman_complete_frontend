"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/components/providers/i18n-provider"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, CheckCircle, XCircle, Clock, Camera } from "lucide-react"

interface KYCVerificationProps {
  currentStatus?: "not_started" | "in_progress" | "under_review" | "approved" | "rejected"
}

interface DocumentType {
  id: string
  name: string
  description: string
  required: boolean
  uploaded: boolean
  status: "pending" | "uploaded" | "approved" | "rejected"
}

export function KYCVerification({ currentStatus = "not_started" }: KYCVerificationProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: "id_card",
      name: t("kyc.idCard"),
      description: "Government issued ID card or passport",
      required: true,
      uploaded: false,
      status: "pending",
    },
    {
      id: "address_proof",
      name: t("kyc.addressProof"),
      description: "Utility bill or bank statement (not older than 3 months)",
      required: true,
      uploaded: false,
      status: "pending",
    },
    {
      id: "professional_license",
      name: t("kyc.professionalLicense"),
      description: "Professional certification or license (if applicable)",
      required: false,
      uploaded: false,
      status: "pending",
    },
    {
      id: "business_registration",
      name: t("kyc.businessRegistration"),
      description: "Business registration certificate (if applicable)",
      required: false,
      uploaded: false,
      status: "pending",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "under_review":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const calculateProgress = () => {
    const uploadedDocs = documents.filter((doc) => doc.uploaded).length
    return (uploadedDocs / documents.length) * 100
  }

  const handleFileUpload = (documentId: string) => {
    console.log("Upload file for:", documentId)

    // Simulate file upload
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === documentId ? { ...doc, uploaded: true, status: "uploaded" } : doc)),
    )

    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully.",
    })
  }

  const handleSubmitForReview = () => {
    const requiredDocs = documents.filter((doc) => doc.required)
    const uploadedRequiredDocs = requiredDocs.filter((doc) => doc.uploaded)

    if (uploadedRequiredDocs.length < requiredDocs.length) {
      toast({
        title: "Missing documents",
        description: "Please upload all required documents before submitting.",
        variant: "destructive",
      })
      return
    }

    console.log("Submit for review")
    toast({
      title: "Submitted for review",
      description: "Your documents have been submitted for verification. We'll review them within 24-48 hours.",
    })
  }

  const renderStatusCard = () => {
    switch (currentStatus) {
      case "approved":
        return (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">{t("kyc.approved")}</h3>
              <p className="text-green-600 dark:text-green-400">
                Your account has been verified successfully. You now have the blue tick!
              </p>
            </CardContent>
          </Card>
        )

      case "rejected":
        return (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">{t("kyc.rejected")}</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">
                Your verification was rejected. Please check the feedback and resubmit.
              </p>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                {t("kyc.resubmit")}
              </Button>
            </CardContent>
          </Card>
        )

      case "under_review":
        return (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                {t("kyc.underReview")}
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400">
                Your documents are being reviewed. This usually takes 24-48 hours.
              </p>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (currentStatus === "approved" || currentStatus === "rejected" || currentStatus === "under_review") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("kyc.verification")}</h1>
          <Badge className={getStatusColor(currentStatus)}>
            {getStatusIcon(currentStatus)}
            <span className="ml-1">{t(`kyc.${currentStatus}`)}</span>
          </Badge>
        </div>
        {renderStatusCard()}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("kyc.getVerified")}</h1>
        <Badge className={getStatusColor(currentStatus)}>
          {getStatusIcon(currentStatus)}
          <span className="ml-1">In Progress</span>
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
          <CardDescription>Complete all required documents to submit for verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle>{t("kyc.uploadDocuments")}</CardTitle>
          <CardDescription>Upload clear photos or scans of your documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{document.name}</h3>
                    {document.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {document.uploaded && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{document.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={document.uploaded ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleFileUpload(document.id)}
                  className="flex items-center gap-2"
                >
                  {document.uploaded ? <Camera className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                  {document.uploaded ? "Replace" : "Upload"}
                </Button>

                {document.uploaded && (
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              By submitting your documents, you agree to our verification process and terms of service.
            </p>
            <Button onClick={handleSubmitForReview} disabled={calculateProgress() < 50} className="w-full">
              {t("kyc.submitForReview")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
