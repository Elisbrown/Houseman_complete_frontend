import type { User, Service, Booking, Review } from "@/types/user"
import { readJsonFile, writeJsonFile, initializeJsonStorage } from "./json-storage"

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

// Enhanced Cameroon names
const CAMEROON_NAMES = {
  male: [
    "Amadou", "Bello", "Celestin", "Didier", "Emmanuel", "Francois", "Georges", "Henri",
    "Ibrahim", "Jean-Baptiste", "Kouam", "Laurent", "Maurice", "Ngozi", "Oscar", "Paul",
    "Roger", "Samuel", "Tchikou", "Victor", "William", "Xavier", "Yves", "Zacharie"
  ],
  female: [
    "Awa", "Bintou", "Charlotte", "Delphine", "Estelle", "Fatima", "Grace", "Hawa",
    "Ines", "Josephine", "Khadija", "Louise", "Marie", "Nadege", "Olivia", "Patience",
    "Rose", "Sylvie", "Therese", "Ursule", "Viviane", "Winifred", "Yvonne", "Zeynab"
  ],
  surnames: [
    "Abanda", "Biya", "Collo", "Douala", "Ekotto", "Foe", "Geremi", "Happi",
    "Idrissou", "Jobarteh", "Kameni", "Lenglen", "Messi", "Nkomo", "Onana", "Peprah",
    "Quincy", "Rigobert", "Siani", "Tchami", "Umaru", "Voukeng", "Wabo", "Yombi", "Zoua"
  ]
}

// Real profile images from Unsplash (diverse African faces)
const PROFILE_IMAGES = [
  "https://images.unsplash.com/photo-1531384370597-9f6b3b4b94b6?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1616012584008-37e0e8d8b3a1?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1594736797933-d0401ba48b81?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
]

// Real service images from Unsplash
const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", // Cleaning
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", // Electrical
  "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop", // Plumbing
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop", // Painting
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop", // Carpentry
  "https://images.unsplash.com/photo-1609205442167-0e3f7ce6ca2f?w=400&h=300&fit=crop", // Auto repair
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop", // Beauty
  "https://images.unsplash.com/photo-1558906650-5d02e71d2fa5?w=400&h=300&fit=crop", // Appliance repair
]

// Enhanced Mock Database with JSON persistence
class EnhancedMockDatabase {
  constructor() {
    this.initializeIfNeeded()
  }

  private async initializeIfNeeded() {
    try {
      await initializeJsonStorage()
      // Check if we need to seed data
      const users = await readJsonFile<User>('users')
      if (users.length === 0) {
        await this.seedDatabase()
      }
    } catch (error) {
      console.error('Failed to initialize database:', error)
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getRandomName(gender: 'male' | 'female') {
    const firstName = CAMEROON_NAMES[gender][Math.floor(Math.random() * CAMEROON_NAMES[gender].length)]
    const lastName = CAMEROON_NAMES.surnames[Math.floor(Math.random() * CAMEROON_NAMES.surnames.length)]
    return { firstName, lastName }
  }

  private async seedDatabase() {
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

    // Generate enhanced users with Cameroon names
    const users: User[] = []

    // Demo accounts with original credentials
    const adminName = this.getRandomName('female')
    users.push({
      id: "admin_001",
      email: "admin@houseman.cm",
      firstName: adminName.firstName,
      lastName: adminName.lastName,
      phone: "+237 677 123 456",
      role: "admin",
      avatar: PROFILE_IMAGES[0],
      isVerified: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: now,
    })

    const clientName = this.getRandomName('male')
    users.push({
      id: "client_001",
      email: "client@houseman.cm",
      firstName: clientName.firstName,
      lastName: clientName.lastName,
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
    })

    const providerName = this.getRandomName('female')
    users.push({
      id: "provider_001",
      email: "provider@houseman.cm",
      firstName: providerName.firstName,
      lastName: providerName.lastName,
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
    })

    // Generate more realistic users
    for (let i = 0; i < 20; i++) {
      const role = Math.random() > 0.7 ? 'provider' : 'client'
      const gender = Math.random() > 0.5 ? 'male' : 'female'
      const name = this.getRandomName(gender)
      
      users.push({
        id: this.generateId(),
        email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@email.com`,
        firstName: name.firstName,
        lastName: name.lastName,
        phone: `+237 6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        role,
        avatar: PROFILE_IMAGES[Math.floor(Math.random() * PROFILE_IMAGES.length)],
        isVerified: Math.random() > 0.3,
        rating: role === 'provider' ? 3.5 + Math.random() * 1.5 : undefined,
        reviewCount: role === 'provider' ? Math.floor(Math.random() * 200) : undefined,
        kycStatus: role === 'provider' ? (Math.random() > 0.2 ? 'approved' : 'pending') : undefined,
        services: [],
        location: {
          address: ["Yaoundé", "Douala", "Bamenda", "Bafoussam", "Garoua"][Math.floor(Math.random() * 5)] + ", Cameroon",
          latitude: 3.8 + Math.random() * 2,
          longitude: 11.5 + Math.random() * 2,
        },
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
        updatedAt: now,
      })
    }

    // Generate services with realistic data
    const services: Service[] = []
    const providers = users.filter(u => u.role === 'provider')
    
    for (const provider of providers) {
      const numServices = 1 + Math.floor(Math.random() * 3) // 1-3 services per provider
      
      for (let i = 0; i < numServices; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)]
        const basePrice = [8000, 12000, 15000, 20000, 25000, 35000, 45000][Math.floor(Math.random() * 7)]
        
        services.push({
          id: this.generateId(),
          providerId: provider.id,
          title: this.generateServiceTitle(category.id),
          description: this.generateServiceDescription(category.id),
          category: category.id,
          price: basePrice + Math.floor(Math.random() * 10000),
          currency: "XAF",
          images: [SERVICE_IMAGES[Math.floor(Math.random() * SERVICE_IMAGES.length)]],
          availability: this.generateAvailability(),
          serviceArea: {
            address: provider.location?.address || "Yaoundé, Cameroon",
            radius: 10 + Math.floor(Math.random() * 20),
          },
          isActive: Math.random() > 0.1,
          createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
          updatedAt: now,
        })
      }
    }

    // Update provider services
    providers.forEach(provider => {
      provider.services = services.filter(s => s.providerId === provider.id)
    })

    // Generate bookings, reviews, messages, etc. (shortened for brevity)
    const bookings: Booking[] = []
    const reviews: Review[] = []
    const messages: Message[] = []
    const conversations: Conversation[] = []
    const notifications: Notification[] = []

    // Save all data
    await writeJsonFile('users', users)
    await writeJsonFile('services', services)
    await writeJsonFile('bookings', bookings)
    await writeJsonFile('reviews', reviews)
    await writeJsonFile('messages', messages)
    await writeJsonFile('conversations', conversations)
    await writeJsonFile('notifications', notifications)
    await writeJsonFile('categories', categories)
  }

  private generateServiceTitle(category: string): string {
    const titles: Record<string, string[]> = {
      cleaning: ["Professional Deep Cleaning", "Home Sanitization Service", "Office Cleaning", "Post-Construction Cleanup"],
      electrical: ["Electrical Installation", "Wiring Repair", "Solar Panel Installation", "Emergency Electrical Service"],
      plumbing: ["Plumbing Repair", "Water System Installation", "Drain Cleaning", "Emergency Plumbing"],
      painting: ["Interior Painting", "Exterior House Painting", "Commercial Painting", "Decorative Painting"],
      carpentry: ["Custom Furniture", "Kitchen Cabinets", "Door Installation", "Wooden Flooring"],
      automotive: ["Car Repair Service", "Vehicle Maintenance", "Auto Diagnostics", "Mobile Mechanic"],
      beauty: ["Hair Styling", "Makeup Service", "Nail Care", "Beauty Consultation"],
      appliance: ["Appliance Repair", "Fridge Fixing", "Washing Machine Service", "Microwave Repair"]
    }
    
    const categoryTitles = titles[category] || ["General Service"]
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)]
  }

  private generateServiceDescription(category: string): string {
    const descriptions: Record<string, string> = {
      cleaning: "Professional cleaning service with eco-friendly products and experienced staff.",
      electrical: "Licensed electrician providing safe and reliable electrical services.",
      plumbing: "Expert plumbing services for residential and commercial properties.",
      painting: "High-quality painting with premium materials and professional finish.",
      carpentry: "Skilled carpentry work with attention to detail and quality craftsmanship.",
      automotive: "Experienced automotive service with modern equipment and genuine parts.",
      beauty: "Professional beauty services in the comfort of your home.",
      appliance: "Expert appliance repair with warranty on parts and labor."
    }
    
    return descriptions[category] || "Quality service by experienced professionals."
  }

  private generateAvailability(): string[] {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const numDays = 4 + Math.floor(Math.random() * 4) // 4-7 days
    return days.slice(0, numDays)
  }

  // CRUD Operations (same as before but using JSON storage)
  async getUsers(): Promise<User[]> {
    return await readJsonFile<User>('users')
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(user => user.id === id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(user => user.email === email) || null
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const users = await this.getUsers()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
    await writeJsonFile('users', users)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    await writeJsonFile('users', users)
    return users[userIndex]
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)
    await writeJsonFile('users', users)
    return true
  }

  // Services CRUD
  async getServices(): Promise<Service[]> {
    return await readJsonFile<Service>('services')
  }

  async getServiceById(id: string): Promise<Service | null> {
    const services = await this.getServices()
    return services.find(service => service.id === id) || null
  }

  async createService(serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
    const services = await this.getServices()
    const newService: Service = {
      ...serviceData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    services.push(newService)
    await writeJsonFile('services', services)
    return newService
  }

  // Bookings CRUD
  async getBookings(): Promise<Booking[]> {
    return await readJsonFile<Booking>('bookings')
  }

  async getBookingsByClient(clientId: string): Promise<Booking[]> {
    const bookings = await this.getBookings()
    return bookings.filter(booking => booking.clientId === clientId)
  }

  async createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
    const bookings = await this.getBookings()
    const newBooking: Booking = {
      ...bookingData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    bookings.push(newBooking)
    await writeJsonFile('bookings', bookings)
    return newBooking
  }

  // Categories
  async getCategories(): Promise<ServiceCategory[]> {
    return await readJsonFile<ServiceCategory>('categories')
  }

  // Search and filter
  async searchServices(query: string, filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    location?: string
    rating?: number
  }): Promise<Service[]> {
    let services = await this.getServices()
    services = services.filter(service => service.isActive)

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
    }

    return services
  }
}

// Create and export singleton instance  
export const enhancedMockDB = new EnhancedMockDatabase()

// Export individual functions for easier usage
export const getUsers = () => enhancedMockDB.getUsers()
export const getUserById = (id: string) => enhancedMockDB.getUserById(id)
export const getUserByEmail = (email: string) => enhancedMockDB.getUserByEmail(email)
export const createUser = (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => enhancedMockDB.createUser(userData)
export const updateUser = (id: string, updates: Partial<User>) => enhancedMockDB.updateUser(id, updates)
export const deleteUser = (id: string) => enhancedMockDB.deleteUser(id)

export const getServices = () => enhancedMockDB.getServices()
export const getServiceById = (id: string) => enhancedMockDB.getServiceById(id)
export const createService = (serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">) => enhancedMockDB.createService(serviceData)

export const getBookings = () => enhancedMockDB.getBookings()
export const getBookingsByClient = (clientId: string) => enhancedMockDB.getBookingsByClient(clientId)
export const createBooking = (bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">) => enhancedMockDB.createBooking(bookingData)

export const getCategories = () => enhancedMockDB.getCategories()
export const searchServices = (query: string, filters?: any) => enhancedMockDB.searchServices(query, filters)