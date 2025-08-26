# Alumni Management Platform

A comprehensive platform for managing alumni relationships, events, mentorship, and donations built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

### 🎓 Alumni Management
- Complete alumni directory with search and filtering
- Detailed profiles with career information, skills, and contact details
- Graduation year and department tracking
- Professional networking capabilities

### 📅 Event Management
- Create and manage alumni events and reunions
- RSVP system with capacity management
- Event discovery and filtering
- Automated notifications

### 🤝 Mentorship Program
- Connect mentees with experienced alumni mentors
- Mentorship request and approval system
- Track mentorship relationships and progress
- Skills-based mentor matching

### 💝 Donation System
- Multiple donation campaigns and causes
- Secure payment processing (ready for Razorpay/Stripe integration)
- Donation tracking and reporting
- Anonymous and named donations

### 👨‍💼 Admin Dashboard
- Comprehensive analytics and reporting
- User and content management
- Event and mentorship oversight
- Donation tracking and management

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin/Alumni)
- Secure password hashing
- Protected API routes

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons
- **SWR** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless backend
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Robust relational database (Neon)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or local)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Update `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to `http://localhost:3000`

## Database Schema

The platform uses a comprehensive database schema with the following entities:
- **Users** - Authentication and user roles
- **Alumni** - Detailed alumni profiles
- **Events** - Alumni events and reunions
- **Event RSVPs** - Event attendance tracking
- **Mentorship Requests** - Mentoring relationships
- **Donations** - Financial contributions

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Alumni
- `GET /api/alumni` - List alumni with filtering and pagination
- `POST /api/alumni` - Create alumni profile

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `POST /api/events/rsvp` - RSVP to event

### Mentorship
- `GET /api/mentorship` - List mentorship requests
- `POST /api/mentorship` - Create mentorship request

### Donations
- `GET /api/donations` - List donations
- `POST /api/donations` - Create donation

## Current Status

✅ **Completed Features:**
- Complete database schema and migrations
- Authentication system (register/login)
- Alumni directory with search and filtering
- Event management and RSVP system
- Mentorship program foundation
- Donation tracking system
- Admin dashboard with analytics
- Responsive UI with modern design
- API routes for all core functionality

🚧 **In Progress:**
- Payment gateway integration (Razorpay/Stripe)
- Email notification system
- Advanced search capabilities
- Mobile PWA features

📋 **Future Enhancements:**
- WhatsApp and SMS integration
- Real-time notifications
- Advanced analytics and reporting
- Mobile app development
- File upload and storage

## Built With Modern Technologies

This alumni management platform leverages cutting-edge web technologies to deliver a fast, secure, and scalable solution for educational institutions worldwide.

---

**Ready to launch!** The platform is now functional and can be deployed to production with your database credentials.
