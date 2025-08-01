"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdminChat } from "../admin/admin-chat"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Briefcase,
  Star,
  Shield,
  CheckCircle,
  Plus,
  Trash2,
  LogOut,
  MessageCircle,
  Flag,
  Eye,
  Ban,
  FileText,
  XCircle,
} from "lucide-react"

const stats = [
  { title: "Total Users", value: "1,234", icon: Users, change: "+12%", color: "text-blue-600" },
  { title: "Active Services", value: "456", icon: Briefcase, change: "+8%", color: "text-green-600" },
  { title: "Pending Reviews", value: "23", icon: Star, change: "-5%", color: "text-yellow-600" },
  { title: "KYC Requests", value: "12", icon: Shield, change: "+15%", color: "text-purple-600" },
]

const mockUsers = [
  {
    id: "1",
    name: "Jean Kouam",
    email: "jean@example.com",
    role: "client",
    status: "active",
    joinedAt: "2024-01-15",
    location: "Yaoundé, Cameroon",
    verified: false,
  },
  {
    id: "2",
    name: "Marie Dubois",
    email: "marie@example.com",
    role: "provider",
    status: "active",
    joinedAt: "2024-01-14",
    location: "Douala, Cameroon",
    verified: true,
  },
  {
    id: "3",
    name: "Paul Ngozi",
    email: "paul@example.com",
    role: "provider",
    status: "suspended",
    joinedAt: "2024-01-10",
    location: "Bamenda, Cameroon",
    verified: false,
  },
]

const mockServices = [
  {
    id: "1",
    title: "Home Cleaning Service",
    provider: "Marie Dubois",
    category: "Cleaning",
    price: 15000,
    status: "active",
    reports: 0,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Suspicious Electrical Work",
    provider: "Unknown Provider",
    category: "Electronics",
    price: 50000,
    status: "flagged",
    reports: 3,
    createdAt: "2024-01-12",
  },
]

const serviceCategories = [
  "Cleaning",
  "Electronics",
  "Painting",
  "Barber",
  "Mechanic",
  "Plumber",
  "Gardener",
  "Carpenter",
]

export function EnhancedAdminDashboard() {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [newCategory, setNewCategory] = useState("")
  const [showAddCategory, setShowAddCategory] = useState(false)

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "delete") => {
    toast({
      title: `User ${action}d`,
      description: `User has been ${action}d successfully.`,
    })
  }

  const handleServiceAction = (serviceId: string, action: "approve" | "remove" | "flag") => {
    toast({
      title: `Service ${action}d`,
      description: `Service has been ${action}d successfully.`,
    })
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      toast({
        title: "Category added",
        description: `"${newCategory}" has been added to service categories.`,
      })
      setNewCategory("")
      setShowAddCategory(false)
    }
  }

  const handleKYCAction = (requestId: string, action: "approve" | "reject") => {
    toast({
      title: `KYC ${action}d`,
      description: `KYC request has been ${action}d successfully.`,
    })
  }

  const mockKYCRequests = [
    {
      id: "kyc_1",
      userName: "Marie Dubois",
      userEmail: "marie@example.com",
      phone: "+237 6XX XXX XXX",
      location: "Douala, Cameroon",
      serviceCategory: "Cleaning Services",
      experience: "5 years",
      status: "pending",
      priority: "normal",
      submittedAt: "2024-01-15",
      documentsCount: 4,
      notes: "Experienced cleaner looking to get verified",
      documents: [
        { type: "National ID", status: "uploaded" },
        { type: "Address Proof", status: "uploaded" },
        { type: "Professional License", status: "uploaded" },
        { type: "Photo", status: "uploaded" },
      ],
    },
    {
      id: "kyc_2",
      userName: "Paul Ngozi",
      userEmail: "paul@example.com",
      phone: "+237 6XX XXX XXX",
      location: "Bamenda, Cameroon",
      serviceCategory: "Electrical Services",
      experience: "8 years",
      status: "under_review",
      priority: "high",
      submittedAt: "2024-01-14",
      documentsCount: 3,
      notes: "Certified electrician with trade license",
      documents: [
        { type: "National ID", status: "uploaded" },
        { type: "Address Proof", status: "uploaded" },
        { type: "Trade License", status: "uploaded" },
      ],
    },
    {
      id: "kyc_3",
      userName: "Alice Kamga",
      userEmail: "alice@example.com",
      phone: "+237 6XX XXX XXX",
      location: "Yaoundé, Cameroon",
      serviceCategory: "Beauty Services",
      experience: "3 years",
      status: "rejected",
      priority: "normal",
      submittedAt: "2024-01-12",
      documentsCount: 2,
      rejectionReason: "Documents were blurry and unreadable",
      notes: "Professional hairstylist and makeup artist",
      documents: [
        { type: "National ID", status: "rejected" },
        { type: "Address Proof", status: "rejected" },
      ],
    },
    {
      id: "kyc_4",
      userName: "Jean Baptiste",
      userEmail: "jean.b@example.com",
      phone: "+237 6XX XXX XXX",
      location: "Douala, Cameroon",
      serviceCategory: "Plumbing",
      experience: "10 years",
      status: "approved",
      priority: "normal",
      submittedAt: "2024-01-10",
      documentsCount: 4,
      notes: "Master plumber with extensive experience",
      documents: [
        { type: "National ID", status: "approved" },
        { type: "Address Proof", status: "approved" },
        { type: "Trade License", status: "approved" },
        { type: "Insurance Certificate", status: "approved" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}. Here's what's happening on Houseman.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Administrator
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const IconComponent = stat.icon
                return (
                  <Card key={stat.title}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-green-600">{stat.change} from last month</p>
                        </div>
                        <div
                          className={`w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ${stat.color}`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>User reports requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Flag className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">Inappropriate behavior</p>
                        <p className="text-xs text-muted-foreground">Reported by Alice Johnson</p>
                      </div>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Flag className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">Service quality issue</p>
                        <p className="text-xs text-muted-foreground">Reported by Bob Smith</p>
                      </div>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Key metrics overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-semibold">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bookings Today</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue (This Month)</span>
                    <span className="font-semibold">2,450,000 XAF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Rating</span>
                    <span className="font-semibold">4.7 ⭐</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex gap-2">
                <Input placeholder="Search users..." className="w-64" />
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="clients">Clients</SelectItem>
                    <SelectItem value="providers">Providers</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {mockUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{user.name}</h3>
                            {user.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <Badge variant={user.role === "provider" ? "default" : "secondary"}>{user.role}</Badge>
                            <Badge variant={user.status === "active" ? "outline" : "destructive"}>{user.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.location} • Joined {user.joinedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        {user.status === "active" ? (
                          <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "suspend")}>
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleUserAction(user.id, "activate")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Service Management</h2>
              <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Service Category</DialogTitle>
                    <DialogDescription>Create a new service category for providers</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category Name</Label>
                      <Input
                        placeholder="e.g., Photography"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddCategory} className="flex-1">
                        Add Category
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddCategory(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Service Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>Manage available service categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {serviceCategories.map((category) => (
                    <div key={category} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{category}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services List */}
            <div className="space-y-4">
              {mockServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{service.title}</h3>
                          <Badge variant={service.status === "active" ? "outline" : "destructive"}>
                            {service.status}
                          </Badge>
                          {service.reports > 0 && <Badge variant="destructive">{service.reports} reports</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {service.provider} • {service.category} • {service.price.toLocaleString()} XAF
                        </p>
                        <p className="text-xs text-muted-foreground">Created {service.createdAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {service.status === "flagged" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleServiceAction(service.id, "remove")}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleServiceAction(service.id, "flag")}>
                          <Flag className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">KYC Management</h2>
              <div className="flex gap-2">
                <Input placeholder="Search KYC requests..." className="w-64" />
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {mockKYCRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{request.userName}</h3>
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "secondary"
                                  : request.status === "under_review"
                                    ? "default"
                                    : request.status === "approved"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {request.status.replace("_", " ")}
                            </Badge>
                            {request.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {request.submittedAt} • {request.documentsCount} documents
                          </p>
                          {request.rejectionReason && (
                            <p className="text-xs text-red-600 mt-1">Previous rejection: {request.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Documents
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>KYC Documents - {request.userName}</DialogTitle>
                              <DialogDescription>Review submitted documents for verification</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              {request.documents.map((doc) => (
                                <div key={doc.type} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{doc.type}</h4>
                                    <Badge variant={doc.status === "uploaded" ? "outline" : "secondary"}>
                                      {doc.status}
                                    </Badge>
                                  </div>
                                  <div className="bg-gray-100 h-32 rounded flex items-center justify-center mb-2">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1">
                                      View Full Size
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              View Request
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>KYC Request Details</DialogTitle>
                              <DialogDescription>Complete request information</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Full Name</Label>
                                  <p className="text-sm">{request.userName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Email</Label>
                                  <p className="text-sm">{request.userEmail}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Phone</Label>
                                  <p className="text-sm">{request.phone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Location</Label>
                                  <p className="text-sm">{request.location}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Service Category</Label>
                                  <p className="text-sm">{request.serviceCategory}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Experience</Label>
                                  <p className="text-sm">{request.experience}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Additional Notes</Label>
                                <p className="text-sm text-muted-foreground">
                                  {request.notes || "No additional notes provided"}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {request.status === "pending" || request.status === "under_review" ? (
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Accept KYC Request</DialogTitle>
                                  <DialogDescription>
                                    This will approve the user's verification and grant them a verified badge.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-sm">
                                    Are you sure you want to approve <strong>{request.userName}</strong>'s KYC request?
                                    This action will:
                                  </p>
                                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                    <li>Grant them a verified badge</li>
                                    <li>Allow them to offer premium services</li>
                                    <li>Increase their profile visibility</li>
                                  </ul>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleKYCAction(request.id, "approve")}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    Confirm Approval
                                  </Button>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1">
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Decline KYC Request</DialogTitle>
                                  <DialogDescription>
                                    Provide feedback for the user to retry their verification.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Reason for Decline</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="blurry_documents">
                                          Documents are blurry or unclear
                                        </SelectItem>
                                        <SelectItem value="incomplete_documents">Missing required documents</SelectItem>
                                        <SelectItem value="invalid_documents">Invalid or expired documents</SelectItem>
                                        <SelectItem value="mismatch_info">
                                          Information doesn't match documents
                                        </SelectItem>
                                        <SelectItem value="other">Other (specify below)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Additional Feedback</Label>
                                    <textarea
                                      className="w-full p-2 border rounded-md text-sm"
                                      rows={3}
                                      placeholder="Provide specific feedback to help the user resubmit correctly..."
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    The user will receive this feedback and can resubmit their documents.
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleKYCAction(request.id, "reject")}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    Send Decline Notice
                                  </Button>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1">
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        ) : (
                          <Badge variant={request.status === "approved" ? "outline" : "destructive"}>
                            {request.status === "approved" ? "Verified" : "Declined"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <AdminChat />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform Commission (%)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Service Price (XAF)</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label>KYC Review Time (hours)</Label>
                    <Input type="number" defaultValue="48" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input type="email" defaultValue="support@houseman.cm" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Platform status and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Platform Version</span>
                  <span>v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span>2024-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Status</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Database Status</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
