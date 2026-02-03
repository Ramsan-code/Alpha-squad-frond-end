# Frontend Architecture Guide

## 🎯 Core Principle: Strict Frontend-Backend Separation

This Next.js frontend maintains **absolute separation** from backend concerns. All business logic, database access, and server-side operations live in the separate Node.js/Express backend.

## 🏗️ Architecture Overview

```
Frontend (Next.js)          Backend (Node.js/Express)
     │                              │
     │    HTTP API Calls            │
     │ ──────────────────────────► │
     │                              │
     │    JSON Responses            │
     │ ◄────────────────────────── │
     │                              │
```

### What This Frontend Does:
- ✅ UI components and pages
- ✅ Client-side state management
- ✅ Form validation (Zod schemas)
- ✅ API communication via `api-client.ts`
- ✅ TypeScript types for data contracts
- ✅ User authentication state (token storage)

### What This Frontend Does NOT Do:
- ❌ Database connections or queries
- ❌ Business logic beyond UI concerns
- ❌ Direct data manipulation
- ❌ Authentication token generation
- ❌ Server-side secrets or credentials

## 📁 Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Main app pages
│   └── layout.tsx         # Root layout
│
├── components/            # Reusable UI components
│   ├── auth/             # Auth-related components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
│
├── hooks/                # Custom React hooks
│   └── use-courses.ts   # Example: courses data hook
│
├── lib/                  # Utilities and helpers
│   ├── api-client.ts    # ⭐ Core API communication layer
│   ├── services/        # Backend API service wrappers
│   │   ├── auth.service.ts
│   │   └── courses.service.ts
│   └── utils.ts         # Utility functions
│
├── schemas/             # Zod validation schemas
│   └── auth.schema.ts  # Form validation only
│
├── store/              # Client state management (Zustand/Redux)
│
└── types/              # TypeScript type definitions
    └── user.ts        # DTOs matching backend models
```

## 🔌 API Communication Pattern

### 1. API Client (`lib/api-client.ts`)

The central HTTP client that handles all backend communication:

```typescript
import { api } from "@/lib/api-client";

// Automatically includes:
// - Base URL from NEXT_PUBLIC_API_URL
// - Authorization header (if token exists)
// - Error handling
// - Type safety

const response = await api.get<ResponseType>("/endpoint");
```

### 2. Service Layer (`lib/services/*.service.ts`)

Service files wrap API endpoints with typed interfaces:

```typescript
// lib/services/auth.service.ts
export const authService = {
  async login(email: string, password: string) {
    return api.post<LoginResponse>("/auth/login", { email, password });
  },
};
```

**Why?**
- Centralizes API endpoint definitions
- Provides type safety for requests/responses
- Makes refactoring easier
- Clear contract with backend

### 3. Custom Hooks (`hooks/*.ts`)

React hooks consume services and manage loading/error states:

```typescript
// hooks/use-courses.ts
export function useCourses(options) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    coursesService.getCourses(options)
      .then(response => setCourses(response.data.courses));
  }, [options]);
  
  return { courses, isLoading };
}
```

### 4. Components Use Hooks

```typescript
// components/courses-list.tsx
export function CoursesList() {
  const { courses, isLoading } = useCourses({ page: 1 });
  
  if (isLoading) return <Spinner />;
  
  return <div>{courses.map(course => <CourseCard {...course} />)}</div>;
}
```

## 🔐 Authentication Flow

### Login Process

1. **User submits credentials** → `LoginForm` component
2. **Form validates** → Zod schema (`schemas/auth.schema.ts`)
3. **Call auth service** → `authService.login(email, password)`
4. **API client sends request** → `POST http://localhost:5000/api/auth/login`
5. **Backend responds** → `{ success: true, data: { user, token } }`
6. **Store token & user** → localStorage/sessionStorage
7. **Navigate to dashboard** → Based on user role

### Authenticated Requests

The API client automatically includes the token:

```typescript
// api-client.ts automatically does this:
const token = localStorage.getItem("lms_token");
headers["Authorization"] = `Bearer ${token}`;
```

## 🌐 Environment Variables

```bash
# .env.local

# Frontend app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API URL (MUST have NEXT_PUBLIC_ prefix for client access)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Cloudinary (frontend only - for upload widget)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

**Important:**
- ✅ `NEXT_PUBLIC_*` variables are exposed to the browser
- ❌ Never put secrets in `NEXT_PUBLIC_*` variables
- ❌ No `MONGODB_URI`, `JWT_SECRET`, or API keys here

## 📝 Creating New Features

### Example: Adding a "Reviews" Feature

#### 1. Define Types (`types/review.ts`)

```typescript
export interface Review {
  _id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

#### 2. Create Service (`lib/services/reviews.service.ts`)

```typescript
import { api, ApiResponse } from "@/lib/api-client";
import { Review } from "@/types/review";

export const reviewsService = {
  async getReviews(courseId: string) {
    return api.get<ApiResponse<{ reviews: Review[] }>>(
      `/courses/${courseId}/reviews`
    );
  },
  
  async createReview(courseId: string, data: { rating: number; comment: string }) {
    return api.post<ApiResponse<{ review: Review }>>(
      `/courses/${courseId}/reviews`,
      data
    );
  },
};
```

#### 3. Create Hook (`hooks/use-reviews.ts`)

```typescript
export function useReviews(courseId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    reviewsService.getReviews(courseId)
      .then(res => setReviews(res.data.reviews))
      .finally(() => setIsLoading(false));
  }, [courseId]);
  
  return { reviews, isLoading };
}
```

#### 4. Create Component (`components/reviews-list.tsx`)

```typescript
export function ReviewsList({ courseId }: { courseId: string }) {
  const { reviews, isLoading } = useReviews(courseId);
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div>
      {reviews.map(review => (
        <ReviewCard key={review._id} {...review} />
      ))}
    </div>
  );
}
```

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Create Next.js API Routes for Backend Logic

```typescript
// ❌ BAD: app/api/courses/route.ts
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  await connectDB();
  const courses = await Course.find(); // NO! This is backend work
  return Response.json(courses);
}
```

### ✅ DO: Call External Backend API

```typescript
// ✅ GOOD: lib/services/courses.service.ts
export const coursesService = {
  async getCourses() {
    return api.get("/courses"); // Calls http://localhost:5000/api/courses
  },
};
```

### ❌ DON'T: Store Secrets in Frontend

```typescript
// ❌ BAD: .env.local
NEXT_PUBLIC_JWT_SECRET=secret123  // Exposed to browser!
NEXT_PUBLIC_DATABASE_URL=mongodb://... // Exposed to browser!
```

### ✅ DO: Only Store Public Config

```typescript
// ✅ GOOD: .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-cloud
```

### ❌ DON'T: Implement Business Logic in Components

```typescript
// ❌ BAD
function EnrollButton({ courseId }) {
  const handleEnroll = async () => {
    // Don't calculate pricing, check eligibility, etc. here
    const price = calculatePrice(course); // Business logic!
    if (user.credits < price) { ... } // Business logic!
  };
}
```

### ✅ DO: Let Backend Handle Business Logic

```typescript
// ✅ GOOD
function EnrollButton({ courseId }) {
  const handleEnroll = async () => {
    // Backend handles all business logic
    const response = await coursesService.enrollCourse(courseId);
    if (response.success) {
      toast.success("Enrolled successfully!");
    }
  };
}
```

## 🧪 Testing Strategy

### Frontend Tests Should Cover:
- ✅ Component rendering
- ✅ User interactions
- ✅ Form validation
- ✅ API service calls (mocked)
- ✅ Hook behavior

### Frontend Tests Should NOT Cover:
- ❌ Database operations
- ❌ Authentication token generation
- ❌ Business logic validation
- ❌ Server-side calculations

## 🎨 UI Development Workflow

1. **Design the component** → Focus on presentation
2. **Define the data contract** → TypeScript types
3. **Create the service** → API communication
4. **Build the hook** → Data fetching logic
5. **Implement the component** → Use the hook
6. **Style with Tailwind** → Premium aesthetics

## 📚 Key Technologies

- **Next.js 16** - App Router, Server Components
- **TypeScript** - Strict type safety
- **Tailwind CSS** - Utility-first styling
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **Radix UI** - Accessible components

## 🔗 Related Documentation

- Backend API: See `Alpha-squad-back-end/README.md`
- API Endpoints: See `Alpha-squad-back-end/postman_collection.json`
- Component Library: See `src/components/ui/`

---

**Remember:** This frontend is a **presentation layer only**. All data, logic, and security live in the backend. Keep it clean, keep it separated.
