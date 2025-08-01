import type { User, Service, Booking, Review } from "@/types/user"

// Additional types for enhanced functionality
export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  messageType: "text" | "image" | "file"
  attachmentUrl?: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  lastActivity: string
  isActive: boolean
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "booking" | "message" | "review" | "system" | "payment"
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
}

// Real profile images from Unsplash (free to use)
const PROFILE_IMAGES = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
]

// Real service images from Unsplash
const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", // Cleaning
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", // Electrical
  "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop", // Plumbing
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop", // Painting
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop", // Carpentry
  "https://images.unsplash.com/photo-1609205442167-0e3f7ce6ca2f?w=400&h=300&fit=crop", // Auto repair
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop", // Haircut/Barber
  "https://images.unsplash.com/photo-1558906650-5d02e71d2fa5?w=400&h=300&fit=crop", // Appliance repair
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop", // Gardening
  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop", // Cooking/Catering
]

// Mock Database Storage (using localStorage for persistence)
class MockDatabase {
  private STORAGE_KEY = "houseman_database"

  private defaultData = {
    users: [] as User[],
    services: [] as Service[],
    bookings: [] as Booking[],
    reviews: [] as Review[],
    messages: [] as Message[],
    conversations: [] as Conversation[],
    notifications: [] as Notification[],
    categories: [] as ServiceCategory[],
  }

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        this.seedDatabase()
      }
    } else {
      // On server-side, always seed the database
      this.seedDatabase()
    }
  }

  private saveData(data: typeof this.defaultData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    }
  }

  private loadData(): typeof this.defaultData {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : this.getDefaultData()
    }
    // On server-side, return seeded data
    return this.getDefaultData()
  }

  private getDefaultData() {
    const now = new Date().toISOString()
    
    // Service Categories
    const categories: ServiceCategory[] = [
      {
        id: "cleaning",
        name: "Cleaning Services",
        description: "Professional home and office cleaning",
        icon: "🧹",
        isActive: true,
      },
      {
        id: "electrical",
        name: "Electrical Services",
        description: "Electrical repairs and installations",
        icon: "⚡",
        isActive: true,
      },
      {
        id: "plumbing",
        name: "Plumbing Services",
        description: "Plumbing repairs and maintenance",
        icon: "🔧",
        isActive: true,
      },
      {
        id: "painting",
        name: "Painting Services",
        description: "Interior and exterior painting",
        icon: "🎨",
        isActive: true,
      },
      {
        id: "carpentry",
        name: "Carpentry Services",
        description: "Furniture and woodwork",
        icon: "🔨",
        isActive: true,
      },
      {
        id: "automotive",
        name: "Automotive Services",
        description: "Car repairs and maintenance",
        icon: "🚗",
        isActive: true,
      },
      {
        id: "beauty",
        name: "Beauty Services",
        description: "Hair, makeup, and grooming",
        icon: "✂️",
        isActive: true,
      },
      {
        id: "appliance",
        name: "Appliance Repair",
        description: "Home appliance services",
        icon: "🔧",
        isActive: true,
      },
    ]

    // Users (including existing demo accounts)
    const users: User[] = [
      // Admin
      {
        id: "admin_001",
        email: "admin@houseman.cm",
        firstName: "Sarah",
        lastName: "Mbeki",
        phone: "+237 677 123 456",
        role: "admin",
        avatar: PROFILE_IMAGES[0],
        isVerified: true,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: now,
      },
      // Demo Client
      {
        id: "client_001",
        email: "client@houseman.cm",
        firstName: "Jean",
        lastName: "Kouam",
        phone: "+237 655 987 654",
        role: "client",
        avatar: PROFILE_IMAGES[1],
        isVerified: false,
        location: {
          address: "Bastos, Yaoundé, Cameroon",
          latitude: 3.848,
          longitude: 11.5021,
        },
        createdAt: "2024-01-15T00:00:00.000Z",
        updatedAt: now,
      },
      // Demo Provider
      {
        id: "provider_001",
        email: "provider@houseman.cm",
        firstName: "Marie",
        lastName: "Dubois",
        phone: "+237 699 456 789",
        role: "provider",
        avatar: PROFILE_IMAGES[2],
        isVerified: true,
        rating: 4.8,
        reviewCount: 124,
        kycStatus: "approved",
        services: [],
        createdAt: "2023-06-01T00:00:00.000Z",
        updatedAt: now,
      },
      // Additional users
      {
        id: "client_002",
        email: "alice.johnson@gmail.com",
        firstName: "Alice",
        lastName: "Johnson",
        phone: "+237 655 123 789",
        role: "client",
        avatar: PROFILE_IMAGES[3],
        isVerified: true,
        location: {
          address: "Bonanjo, Douala, Cameroon",
          latitude: 4.0435,
          longitude: 9.7009,
        },
        createdAt: "2024-02-10T00:00:00.000Z",
        updatedAt: now,
      },
      {
        id: "provider_002",
        email: "paul.ngozi@gmail.com",
        firstName: "Paul",
        lastName: "Ngozi",
        phone: "+237 699 789 456",
        role: "provider",
        avatar: PROFILE_IMAGES[5],
        isVerified: true,
        rating: 4.7,
        reviewCount: 89,
        kycStatus: "approved",
        services: [],
        createdAt: "2023-08-15T00:00:00.000Z",
        updatedAt: now,
      },
    ]

    // Services
    const services: Service[] = [
      {
        id: "service_001",
        providerId: "provider_001",
        title: "Professional Home Deep Cleaning",
        description: "Complete deep cleaning service for your home including kitchen, bathrooms, bedrooms, and living areas. Eco-friendly products used.",
        category: "cleaning",
        price: 15000,
        currency: "XAF",
        images: [SERVICE_IMAGES[0], SERVICE_IMAGES[0]],
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        serviceArea: {
          address: "Yaoundé, Centre Region, Cameroon",
          radius: 15,
        },
        isActive: true,
        createdAt: "2023-06-01T00:00:00.000Z",
        updatedAt: now,
      },
      {
        id: "service_002",
        providerId: "provider_002",
        title: "Electrical Installation & Repair",
        description: "Expert electrical services including wiring, socket installation, lighting, and troubleshooting electrical issues.",
        category: "electrical",
        price: 8000,
        currency: "XAF",
        images: [SERVICE_IMAGES[1]],
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        serviceArea: {
          address: "Douala, Littoral Region, Cameroon",
          radius: 20,
        },
        isActive: true,
        createdAt: "2023-08-15T00:00:00.000Z",
        updatedAt: now,
      },
    ]

    // Update provider services
    users.forEach(user => {
      if (user.role === "provider") {
        user.services = services.filter(service => service.providerId === user.id)
      }
    })

    // Bookings
    const bookings: Booking[] = [
      {
        id: "booking_001",
        clientId: "client_001",
        providerId: "provider_001",
        serviceId: "service_001",
        status: "completed",
        scheduledDate: "2024-01-20",
        scheduledTime: "09:00",
        address: "Bastos, Yaoundé, Cameroon",
        notes: "Please bring eco-friendly cleaning products. House has 3 bedrooms and 2 bathrooms.",
        price: 15000,
        currency: "XAF",
        createdAt: "2024-01-18T00:00:00.000Z",
        updatedAt: "2024-01-20T12:00:00.000Z",
      },
      {
        id: "booking_002",
        clientId: "client_001",
        providerId: "provider_002",
        serviceId: "service_002",
        status: "confirmed",
        scheduledDate: "2024-02-15",
        scheduledTime: "09:00",
        address: "123 Main Street, Yaoundé, Cameroon",
        notes: "Regular house cleaning service",
        price: 15000,
        currency: "XAF",
        createdAt: "2024-02-10T08:00:00.000Z",
        updatedAt: "2024-02-10T08:00:00.000Z",
      },
      {
        id: "booking_003",
        clientId: "client_001",
        providerId: "provider_003",
        serviceId: "service_002",
        status: "in-progress",
        scheduledDate: "2024-02-13",
        scheduledTime: "14:00",
        address: "456 Oak Avenue, Douala, Cameroon",
        notes: "Electrical installation in progress",
        price: 28000,
        currency: "XAF",
        createdAt: "2024-02-12T10:00:00.000Z",
        updatedAt: "2024-02-13T14:00:00.000Z",
      },
      {
        id: "booking_004",
        clientId: "client_001",
        providerId: "provider_004",
        serviceId: "service_001",
        status: "cancelled",
        scheduledDate: "2024-02-05",
        scheduledTime: "16:00",
        address: "321 Cedar Road, Bafoussam, Cameroon",
        notes: "Had to cancel due to emergency",
        price: 22000,
        currency: "XAF",
        createdAt: "2024-02-01T09:00:00.000Z",
        updatedAt: "2024-02-04T15:00:00.000Z",
      },
      {
        id: "booking_005",
        clientId: "client_001",
        providerId: "provider_005",
        serviceId: "service_001",
        status: "pending",
        scheduledDate: "2024-02-20",
        scheduledTime: "10:00",
        address: "555 Elm Street, Garoua, Cameroon",
        notes: "Waiting for provider confirmation",
        price: 25000,
        currency: "XAF",
        createdAt: "2024-02-14T11:00:00.000Z",
        updatedAt: "2024-02-14T11:00:00.000Z",
      },
    ]

    // Reviews
    const reviews: Review[] = [
      {
        id: "review_001",
        bookingId: "booking_001",
        clientId: "client_001",
        providerId: "provider_001",
        rating: 5,
        comment: "Excellent service! Marie and her team were very professional and thorough. My house looks amazing. Highly recommended!",
        createdAt: "2024-01-20T15:00:00.000Z",
      },
    ]

    // Messages and Conversations
    const conversations: Conversation[] = [
      {
        id: "conv_001",
        participants: ["client_001", "provider_001"],
        lastActivity: "2024-01-26T10:30:00.000Z",
        isActive: true,
      },
    ]

    const messages: Message[] = [
      {
        id: "msg_001",
        conversationId: "conv_001",
        senderId: "client_001",
        receiverId: "provider_001",
        content: "Hi Marie, I'm interested in your deep cleaning service. Are you available next week?",
        timestamp: "2024-01-26T09:00:00.000Z",
        isRead: true,
        messageType: "text",
      },
    ]

    // Update conversations with last messages
    conversations.forEach(conv => {
      const lastMsg = messages
        .filter(msg => msg.conversationId === conv.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      conv.lastMessage = lastMsg
    })

    // Notifications
    const notifications: Notification[] = [
      {
        id: "notif_001",
        userId: "client_001",
        title: "Booking Confirmed",
        message: "Your cleaning service booking with Marie Dubois has been confirmed for Jan 20th.",
        type: "booking",
        isRead: true,
        createdAt: "2024-01-18T10:00:00.000Z",
        actionUrl: "/bookings/booking_001",
      },
    ]

    return {
      users,
      services,
      bookings,
      reviews,
      messages,
      conversations,
      notifications,
      categories,
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private seedDatabase() {
    const seedData = this.getDefaultData()
    this.saveData(seedData)
  }

  // CRUD Operations for Users
  getUsers(): User[] {
    return this.loadData().users
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find(user => user.id === id) || null
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find(user => user.email === email) || null
  }

  createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const data = this.loadData()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.users.push(newUser)
    this.saveData(data)
    return newUser
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const data = this.loadData()
    const userIndex = data.users.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveData(data)
    return data.users[userIndex]
  }

  deleteUser(id: string): boolean {
    const data = this.loadData()
    const userIndex = data.users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    data.users.splice(userIndex, 1)
    this.saveData(data)
    return true
  }

  // CRUD Operations for Services
  getServices(): Service[] {
    return this.loadData().services
  }

  getServiceById(id: string): Service | null {
    const services = this.getServices()
    return services.find(service => service.id === id) || null
  }

  getServicesByProvider(providerId: string): Service[] {
    const services = this.getServices()
    return services.filter(service => service.providerId === providerId)
  }

  getServicesByCategory(category: string): Service[] {
    const services = this.getServices()
    return services.filter(service => service.category === category && service.isActive)
  }

  createService(serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">): Service {
    const data = this.loadData()
    const newService: Service = {
      ...serviceData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.services.push(newService)
    this.saveData(data)
    return newService
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const data = this.loadData()
    const serviceIndex = data.services.findIndex(service => service.id === id)
    if (serviceIndex === -1) return null

    data.services[serviceIndex] = {
      ...data.services[serviceIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveData(data)
    return data.services[serviceIndex]
  }

  deleteService(id: string): boolean {
    const data = this.loadData()
    const serviceIndex = data.services.findIndex(service => service.id === id)
    if (serviceIndex === -1) return false

    data.services.splice(serviceIndex, 1)
    this.saveData(data)
    return true
  }

  // CRUD Operations for Bookings
  getBookings(): Booking[] {
    return this.loadData().bookings
  }

  getBookingById(id: string): Booking | null {
    const bookings = this.getBookings()
    return bookings.find(booking => booking.id === id) || null
  }

  getBookingsByClient(clientId: string): Booking[] {
    const bookings = this.getBookings()
    return bookings.filter(booking => booking.clientId === clientId)
  }

  getBookingsByProvider(providerId: string): Booking[] {
    const bookings = this.getBookings()
    return bookings.filter(booking => booking.providerId === providerId)
  }

  createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
    const data = this.loadData()
    const newBooking: Booking = {
      ...bookingData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.bookings.push(newBooking)
    this.saveData(data)
    return newBooking
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const data = this.loadData()
    const bookingIndex = data.bookings.findIndex(booking => booking.id === id)
    if (bookingIndex === -1) return null

    data.bookings[bookingIndex] = {
      ...data.bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveData(data)
    return data.bookings[bookingIndex]
  }

  deleteBooking(id: string): boolean {
    const data = this.loadData()
    const bookingIndex = data.bookings.findIndex(booking => booking.id === id)
    if (bookingIndex === -1) return false

    data.bookings.splice(bookingIndex, 1)
    this.saveData(data)
    return true
  }

  // CRUD Operations for Reviews
  getReviews(): Review[] {
    return this.loadData().reviews
  }

  getReviewById(id: string): Review | null {
    const reviews = this.getReviews()
    return reviews.find(review => review.id === id) || null
  }

  getReviewsByProvider(providerId: string): Review[] {
    const reviews = this.getReviews()
    return reviews.filter(review => review.providerId === providerId)
  }

  createReview(reviewData: Omit<Review, "id" | "createdAt">): Review {
    const data = this.loadData()
    const newReview: Review = {
      ...reviewData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }
    data.reviews.push(newReview)
    this.saveData(data)
    return newReview
  }

  // CRUD Operations for Messages
  getMessages(): Message[] {
    return this.loadData().messages
  }

  getMessagesByConversation(conversationId: string): Message[] {
    const messages = this.getMessages()
    return messages.filter(msg => msg.conversationId === conversationId)
  }

  createMessage(messageData: Omit<Message, "id" | "timestamp">): Message {
    const data = this.loadData()
    const newMessage: Message = {
      ...messageData,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    }
    data.messages.push(newMessage)
    this.saveData(data)
    return newMessage
  }

  markMessageAsRead(id: string): boolean {
    const data = this.loadData()
    const messageIndex = data.messages.findIndex(msg => msg.id === id)
    if (messageIndex === -1) return false

    data.messages[messageIndex].isRead = true
    this.saveData(data)
    return true
  }

  // CRUD Operations for Conversations
  getConversations(): Conversation[] {
    return this.loadData().conversations
  }

  getConversationByParticipants(participant1: string, participant2: string): Conversation | null {
    const conversations = this.getConversations()
    return conversations.find(conv => 
      conv.participants.includes(participant1) && conv.participants.includes(participant2)
    ) || null
  }

  createConversation(participants: string[]): Conversation {
    const data = this.loadData()
    const newConversation: Conversation = {
      id: this.generateId(),
      participants,
      lastActivity: new Date().toISOString(),
      isActive: true,
    }
    data.conversations.push(newConversation)
    this.saveData(data)
    return newConversation
  }

  // CRUD Operations for Notifications
  getNotifications(): Notification[] {
    return this.loadData().notifications
  }

  getNotificationsByUser(userId: string): Notification[] {
    const notifications = this.getNotifications()
    return notifications.filter(notif => notif.userId === userId)
  }

  createNotification(notificationData: Omit<Notification, "id" | "createdAt">): Notification {
    const data = this.loadData()
    const newNotification: Notification = {
      ...notificationData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }
    data.notifications.push(newNotification)
    this.saveData(data)
    return newNotification
  }

  markNotificationAsRead(id: string): boolean {
    const data = this.loadData()
    const notifIndex = data.notifications.findIndex(notif => notif.id === id)
    if (notifIndex === -1) return false

    data.notifications[notifIndex].isRead = true
    this.saveData(data)
    return true
  }

  // Service Categories
  getCategories(): ServiceCategory[] {
    return this.loadData().categories
  }

  // Search and Filter Operations
  searchServices(query: string, filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    location?: string
    rating?: number
  }): Service[] {
    let services = this.getServices().filter(service => service.isActive)

    // Text search
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      services = services.filter(service =>
        service.title.toLowerCase().includes(lowercaseQuery) ||
        service.description.toLowerCase().includes(lowercaseQuery) ||
        service.category.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        services = services.filter(service => service.category === filters.category)
      }
      if (filters.minPrice !== undefined) {
        services = services.filter(service => service.price >= filters.minPrice!)
      }
      if (filters.maxPrice !== undefined) {
        services = services.filter(service => service.price <= filters.maxPrice!)
      }
      // Additional filters can be implemented as needed
    }

    return services
  }

  // Analytics for Admin Dashboard
  getAnalytics() {
    const data = this.loadData()
    
    return {
      totalUsers: data.users.length,
      totalClients: data.users.filter(user => user.role === "client").length,
      totalProviders: data.users.filter(user => user.role === "provider").length,
      totalServices: data.services.filter(service => service.isActive).length,
      totalBookings: data.bookings.length,
      pendingBookings: data.bookings.filter(booking => booking.status === "pending").length,
      completedBookings: data.bookings.filter(booking => booking.status === "completed").length,
      totalRevenue: data.bookings
        .filter(booking => booking.status === "completed")
        .reduce((sum, booking) => sum + booking.price, 0),
      averageRating: data.reviews.length > 0 
        ? data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length 
        : 0,
      pendingKyc: data.users.filter(user => user.role === "provider" && user.kycStatus === "pending").length,
    }
  }
}

// Create and export singleton instance
export const mockDB = new MockDatabase()

// Export individual functions for easier usage (with proper context binding)
export const getUsers = () => mockDB.getUsers()
export const getUserById = (id: string) => mockDB.getUserById(id)
export const getUserByEmail = (email: string) => mockDB.getUserByEmail(email)
export const createUser = (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => mockDB.createUser(userData)
export const updateUser = (id: string, updates: Partial<User>) => mockDB.updateUser(id, updates)
export const deleteUser = (id: string) => mockDB.deleteUser(id)

export const getServices = () => mockDB.getServices()
export const getServiceById = (id: string) => mockDB.getServiceById(id)
export const getServicesByProvider = (providerId: string) => mockDB.getServicesByProvider(providerId)
export const getServicesByCategory = (category: string) => mockDB.getServicesByCategory(category)
export const createService = (serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">) => mockDB.createService(serviceData)
export const updateService = (id: string, updates: Partial<Service>) => mockDB.updateService(id, updates)
export const deleteService = (id: string) => mockDB.deleteService(id)

export const getBookings = () => mockDB.getBookings()
export const getBookingById = (id: string) => mockDB.getBookingById(id)
export const getBookingsByClient = (clientId: string) => mockDB.getBookingsByClient(clientId)
export const getBookingsByProvider = (providerId: string) => mockDB.getBookingsByProvider(providerId)
export const createBooking = (bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">) => mockDB.createBooking(bookingData)
export const updateBooking = (id: string, updates: Partial<Booking>) => mockDB.updateBooking(id, updates)
export const deleteBooking = (id: string) => mockDB.deleteBooking(id)

export const getReviews = () => mockDB.getReviews()
export const getReviewsByProvider = (providerId: string) => mockDB.getReviewsByProvider(providerId)
export const createReview = (reviewData: Omit<Review, "id" | "createdAt">) => mockDB.createReview(reviewData)

export const getMessages = () => mockDB.getMessages()
export const getMessagesByConversation = (conversationId: string) => mockDB.getMessagesByConversation(conversationId)
export const createMessage = (messageData: Omit<Message, "id" | "timestamp">) => mockDB.createMessage(messageData)
export const markMessageAsRead = (id: string) => mockDB.markMessageAsRead(id)

export const getConversations = () => mockDB.getConversations()
export const getConversationByParticipants = (participant1: string, participant2: string) => mockDB.getConversationByParticipants(participant1, participant2)
export const createConversation = (participants: string[]) => mockDB.createConversation(participants)

export const getNotifications = () => mockDB.getNotifications()
export const getNotificationsByUser = (userId: string) => mockDB.getNotificationsByUser(userId)
export const createNotification = (notificationData: Omit<Notification, "id" | "createdAt">) => mockDB.createNotification(notificationData)
export const markNotificationAsRead = (id: string) => mockDB.markNotificationAsRead(id)

export const getCategories = () => mockDB.getCategories()
export const searchServices = (query: string, filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  rating?: number
}) => mockDB.searchServices(query, filters)
export const getAnalytics = () => mockDB.getAnalytics()