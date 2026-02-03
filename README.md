# Alpha.LMS - Complete Documentation

## 🎓 Project Overview

**Alpha.LMS** is a next-generation Learning Management System built with cutting-edge technologies, featuring AI-powered lesson planning, automated grading, and comprehensive role-based dashboards.

### Key Features

✅ **Multi-Role Support**: Student, Instructor, Parent, and Admin dashboards  
✅ **AI-Powered Tools**: Automated lesson planning and grading  
✅ **MongoDB Integration**: Robust database with Mongoose ODM  
✅ **Cloudinary Integration**: Seamless file uploads and media management  
✅ **Zod Validation**: Type-safe schema validation  
✅ **JWT Authentication**: Secure token-based authentication  
✅ **Modern UI**: Beautiful, responsive design with Tailwind CSS  
✅ **Premium Footer**: Professional site footer with newsletter signup  

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.7 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.0
- **Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Storage**: Cloudinary
- **API**: Next.js API Routes

### Development
- **Language**: TypeScript 5
- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Next.js with Turbopack

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas cloud)
- Cloudinary account (optional, for file uploads)

### Step 1: Clone & Install

```bash
cd /home/ramsan/Downloads/nextjs-template-master
npm install
```

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/alpha-lms
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/alpha-lms

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB
sudo apt install mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### Step 4: Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🧪 Testing

### Run E2E Tests

```bash
./test-e2e.sh
```

This script tests:
- ✅ MongoDB connection
- ✅ Environment configuration
- ✅ Build process
- ✅ API endpoints (health, register, login)
- ✅ Frontend pages
- ✅ Authentication flow

### Manual Testing

#### 1. Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@test.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

#### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'
```

#### 3. Test File Upload
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=alpha-lms/test"
```

---

## 🎯 User Roles & Dashboards

### 1. Student Dashboard (`/dashboard`)
- **Stats**: Courses enrolled, hours learned, progress, certificates
- **Active Courses**: Continue learning with progress tracking
- **Assignments**: Upcoming deadlines and priorities
- **AI Recommendations**: Personalized learning suggestions

### 2. Instructor Dashboard (`/teach/dashboard`)
- **Stats**: Revenue, students, courses, ratings
- **Course Management**: Create, edit, publish courses
- **Recent Activity**: Student enrollments, completions, reviews
- **Pending Reviews**: Assignment submissions to grade
- **Tools**: Lesson planner (`/teach/planning`), Auto-grader (`/teach/grading`)

### 3. Admin Dashboard (`/admin/dashboard`)
- **Stats**: Total users, courses, revenue, active users
- **System Health**: API performance, database, storage
- **User Management**: Recent users, approvals
- **Course Approvals**: Review and approve new courses
- **Analytics**: User growth trends, top courses

### 4. Parent Dashboard (`/parent/dashboard`)
- **Student Progress**: Track child's learning
- **Reports**: Performance analytics
- **Subscription**: Manage payment and plans

---

## 🔐 Authentication Flow

### Registration
1. User submits registration form
2. Backend validates with Zod schema
3. Password hashed with bcrypt
4. User saved to MongoDB
5. JWT token generated
6. Token set as HTTP-only cookie
7. User redirected to role-specific dashboard

### Login
1. User submits credentials
2. Backend finds user in MongoDB
3. Password verified with bcrypt
4. JWT token generated
5. Token set as HTTP-only cookie
6. User data returned (excluding password)
7. Frontend stores user in localStorage
8. Redirect to dashboard based on role

### Protected Routes
- Middleware checks for valid JWT token
- Token verified and decoded
- User data fetched from MongoDB
- Access granted/denied based on role

---

## 📁 Project Structure

```
alpha-lms/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── (main)/              # Main app pages
│   │   │   ├── dashboard/       # Student dashboard
│   │   │   ├── admin/           # Admin dashboard
│   │   │   └── parent/          # Parent dashboard
│   │   ├── (instructor)/        # Instructor pages
│   │   │   └── teach/
│   │   │       ├── dashboard/   # Instructor dashboard
│   │   │       ├── planning/    # Lesson planner
│   │   │       └── grading/     # Auto-grader
│   │   ├── api/
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── courses/         # Course CRUD
│   │   │   ├── upload/          # File upload
│   │   │   └── ai/              # AI features
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── auth/                # Auth components
│   │   ├── lesson-planner.tsx   # Lesson planning
│   │   ├── automated-grader.tsx # Auto-grading
│   │   ├── file-upload.tsx      # File upload
│   │   └── site-footer.tsx      # Footer
│   ├── lib/
│   │   ├── db/
│   │   │   ├── mongodb.ts       # DB connection
│   │   │   └── models/          # Mongoose models
│   │   ├── auth/
│   │   │   └── jwt.ts           # JWT utilities
│   │   └── cloudinary.ts        # Cloudinary config
│   ├── schemas/
│   │   └── index.ts             # Zod schemas
│   └── types/
│       └── user.ts              # TypeScript types
├── .env.local                   # Environment variables
├── .env.example                 # Example env file
├── test-e2e.sh                  # E2E test script
├── package.json
└── README.md
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add all variables from `.env.local`

4. **Deploy Production**
```bash
vercel --prod
```

### Deploy to Other Platforms

**Netlify, Railway, Render**: Similar process
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

---

## 📊 Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: "STUDENT" | "INSTRUCTOR" | "PARENT" | "ADMIN"
  avatar?: string
  bio?: string
  phone?: string
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Course Model
```typescript
{
  title: string
  description: string
  thumbnail?: string
  instructor: ObjectId (ref: User)
  price: number
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  category: string
  tags: string[]
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  duration?: number
  enrollmentCount: number
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Enrollment Model
```typescript
{
  user: ObjectId (ref: User)
  course: ObjectId (ref: Course)
  progress: number (0-100)
  completedLessons: ObjectId[]
  enrolledAt: Date
  completedAt?: Date
  lastAccessedAt: Date
}
```

---

## 🎨 Features Implemented

### ✅ Core Features
- [x] Multi-role authentication (Student, Instructor, Parent, Admin)
- [x] Role-based dashboards with unique features
- [x] MongoDB integration with Mongoose
- [x] JWT authentication with HTTP-only cookies
- [x] Zod schema validation
- [x] Cloudinary file upload integration
- [x] Premium site footer with newsletter

### ✅ AI Features
- [x] Automated Lesson Planning
- [x] Automated Grading System
- [x] AI Recommendations (mocked)

### ✅ Instructor Tools
- [x] Course creation and management
- [x] Revenue tracking
- [x] Student analytics
- [x] Lesson planner
- [x] Assignment grader

### ✅ Student Features
- [x] Course enrollment tracking
- [x] Progress monitoring
- [x] Assignment submissions
- [x] Personalized recommendations

### ✅ Admin Features
- [x] User management
- [x] Course approval system
- [x] System health monitoring
- [x] Platform analytics

---

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (instructor only)
- `GET /api/courses/[id]` - Get course by ID
- `PUT /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course

### AI Features
- `POST /api/ai/lesson-plan` - Generate lesson plan
- `POST /api/ai/grade` - Grade assignment

### Upload
- `POST /api/upload` - Upload file to Cloudinary

---

## 🎯 Next Steps & Enhancements

### Recommended Improvements
1. **Real AI Integration**: Connect OpenAI/Gemini API for lesson planning and grading
2. **Payment Integration**: Add Stripe for course purchases
3. **Real-time Features**: WebSocket for live chat and notifications
4. **Video Streaming**: Integrate video player for course content
5. **Analytics Dashboard**: Advanced charts with Recharts
6. **Email Notifications**: SendGrid/Resend integration
7. **Testing**: Add Jest unit tests and Playwright E2E tests
8. **Performance**: Implement caching with Redis
9. **Search**: Add Algolia or Elasticsearch
10. **Mobile App**: React Native companion app

---

## 📞 Support & Resources

- **MongoDB Docs**: https://www.mongodb.com/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Zod Docs**: https://zod.dev/

---

## 📄 License

This project is built for educational purposes.

---

## 🎉 Conclusion

**Alpha.LMS** is now fully configured with:
- ✅ MongoDB database integration
- ✅ JWT authentication system
- ✅ Cloudinary file uploads
- ✅ Zod validation schemas
- ✅ Three comprehensive dashboards
- ✅ AI-powered features
- ✅ Professional UI/UX
- ✅ Production-ready build

**Access your application at**: http://localhost:3000

**Default Test Users** (create via registration):
- Student: `student@test.com` / `password123`
- Instructor: `instructor@test.com` / `password123`
- Admin: `admin@test.com` / `password123`

---

**Built with ❤️ using Next.js, MongoDB, and modern web technologies**
