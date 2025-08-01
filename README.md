# Houseman - Service Provider Platform

Houseman is a comprehensive service provider platform designed for the Central African (CEMAC) region, connecting clients with verified service providers across various categories including cleaning, electronics, beauty, automotive, and more.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login/registration for clients, providers, and admins
- **Service Marketplace**: Browse and book services from verified providers
- **Real-time Chat**: Communicate with service providers through integrated messaging
- **Booking Management**: Schedule, track, and manage service appointments
- **Review System**: Rate and review completed services
- **KYC Verification**: Document verification for service providers
- **Multi-language Support**: English and French language options
- **Progressive Web App**: Mobile-optimized experience with offline capabilities

### User Roles
- **Clients**: Browse services, book appointments, chat with providers
- **Providers**: List services, manage bookings, communicate with clients
- **Admins**: Manage users, verify KYC documents, oversee platform operations

### Technical Features
- **PostgreSQL Database**: Robust data storage with Supabase
- **Vercel Blob Storage**: Secure file uploads for profiles and documents
- **Real-time Updates**: Live chat and notification system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: shadcn/ui components with smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Vercel account for deployment

### Environment Variables
Create a `.env.local` file with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Database (if using direct PostgreSQL)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_HOST=your_postgres_host
\`\`\`

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd houseman-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up the database**
   
   Run the SQL scripts in order:
   \`\`\`bash
   # Execute these scripts in your PostgreSQL database
   # 1. scripts/01-create-tables.sql
   # 2. scripts/02-seed-data.sql  
   # 3. scripts/03-create-functions.sql
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and basic information
- **user_profiles**: Extended user profile data
- **service_categories**: Service category definitions
- **services**: Service listings from providers
- **bookings**: Service appointments and scheduling
- **conversations**: Chat conversations between users
- **messages**: Individual chat messages
- **reviews**: Service ratings and feedback
- **kyc_verifications**: Provider verification documents

### Key Features
- UUID primary keys for all tables
- JSONB columns for flexible data storage
- Automatic timestamp management
- Referential integrity with foreign keys
- Indexes for optimal query performance

## 🔐 Authentication

### Demo Accounts
For testing purposes, use these demo credentials:

**Admin Account:**
- Email: `admin@houseman.cm`
- Password: `HousemanAdmin2024!`

**Client Account:**
- Email: `client@houseman.cm` 
- Password: `ClientDemo123!`

**Provider Account:**
- Email: `provider@houseman.cm`
- Password: `ProviderDemo123!`

### Production Setup
1. Configure Supabase authentication
2. Set up password hashing with bcrypt
3. Implement JWT token management
4. Add social login providers (Google, Facebook)

## 📱 Mobile Support

Houseman is built as a Progressive Web App (PWA) with:
- Responsive design for all screen sizes
- Offline functionality
- App-like experience on mobile devices
- Push notification support (coming soon)

## 🌍 Internationalization

The platform supports multiple languages:
- **English** (default)
- **French** (Français)

Language preferences are stored locally and persist across sessions.

## 🎨 UI/UX Features

- **Dark/Light Mode**: System-aware theme switching
- **Smooth Animations**: Framer Motion powered transitions
- **Accessible Design**: WCAG compliant interface
- **Modern Components**: shadcn/ui component library
- **Responsive Layout**: Mobile-first design approach

## 🔧 Development

### Project Structure
\`\`\`
houseman-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── services/         # Service-related components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Supabase
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Type Safety**: TypeScript
- **Authentication**: Custom JWT implementation
- **File Storage**: Vercel Blob
- **Deployment**: Vercel Platform

### Development Commands
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Push code to GitHub/GitLab
   - Connect repository to Vercel
   - Configure environment variables

2. **Database Setup**
   - Create Supabase project
   - Run database migration scripts
   - Configure connection strings

3. **Environment Configuration**
   - Add all required environment variables
   - Configure Vercel Blob storage
   - Set up domain (optional)

### Manual Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to your hosting provider**
   - Upload build files
   - Configure environment variables
   - Set up database connection

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Content sanitization
- **CSRF Protection**: Built-in Next.js protection
- **File Upload Security**: Type and size validation

## 📊 Monitoring & Analytics

- **Error Tracking**: Built-in error boundaries
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Privacy-focused analytics
- **Database Monitoring**: Query performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: support@houseman.cm
- **Documentation**: [Project Wiki]
- **Issues**: [GitHub Issues]

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core platform functionality
- ✅ User authentication and profiles
- ✅ Service marketplace
- ✅ Real-time chat
- ✅ Booking system

### Phase 2 (Coming Soon)
- 🔄 Payment integration
- 🔄 Push notifications
- 🔄 Advanced search filters
- 🔄 Service provider analytics
- 🔄 Mobile app (React Native)

### Phase 3 (Future)
- 📅 AI-powered recommendations
- 📅 Video calling integration
- 📅 Multi-vendor marketplace
- 📅 Advanced reporting
- 📅 API for third-party integrations

---

**Built with ❤️ for the CEMAC region by Sunyin Elisbrown**
