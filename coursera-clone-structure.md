# Coursera Clone - Frontend Structure

## Project Overview
A modern online learning platform with React/Next.js, featuring course browsing, video playback, user profiles, and progress tracking.

---

## Technology Stack

### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand / Redux Toolkit
- **API Client**: Axios / React Query (TanStack Query)

### Additional Libraries
- **Video Player**: Video.js / Plyr
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## Directory Structure

```
coursera-clone/
├── public/
│   ├── images/
│   │   ├── courses/
│   │   ├── instructors/
│   │   ├── logos/
│   │   └── placeholders/
│   ├── videos/
│   └── icons/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (main)/                   # Main app route group
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # Browse courses
│   │   │   │   ├── [courseId]/
│   │   │   │   │   ├── page.tsx      # Course details
│   │   │   │   │   └── learn/
│   │   │   │   │       └── page.tsx  # Learning interface
│   │   │   │   └── category/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── my-learning/
│   │   │   │   └── page.tsx          # Enrolled courses
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── achievements/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── instructors/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [instructorId]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (instructor)/             # Instructor route group
│   │   │   ├── teach/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [courseId]/
│   │   │   │   │       ├── edit/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       └── analytics/
│   │   │   │   │           └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── courses/
│   │   │   └── users/
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   │
│   │   ├── course/                   # Course-related components
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── CourseDetails.tsx
│   │   │   ├── CourseCurriculum.tsx
│   │   │   ├── CourseReviews.tsx
│   │   │   ├── CourseProgress.tsx
│   │   │   ├── EnrollButton.tsx
│   │   │   └── CourseFilter.tsx
│   │   │
│   │   ├── learning/                 # Learning interface components
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── LessonList.tsx
│   │   │   ├── LessonContent.tsx
│   │   │   ├── QuizInterface.tsx
│   │   │   ├── AssignmentUpload.tsx
│   │   │   ├── DiscussionForum.tsx
│   │   │   ├── Notes.tsx
│   │   │   └── ProgressTracker.tsx
│   │   │
│   │   ├── instructor/               # Instructor components
│   │   │   ├── CourseBuilder.tsx
│   │   │   ├── CurriculumEditor.tsx
│   │   │   ├── VideoUploader.tsx
│   │   │   ├── QuizBuilder.tsx
│   │   │   ├── StudentList.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   └── RevenueChart.tsx
│   │   │
│   │   ├── auth/                     # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── SocialLogin.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── profile/                  # Profile components
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── AchievementBadges.tsx
│   │   │   ├── CertificateList.tsx
│   │   │   └── SettingsForm.tsx
│   │   │
│   │   ├── search/                   # Search components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── AutocompleteSearch.tsx
│   │   │
│   │   └── common/                   # Shared components
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Pagination.tsx
│   │       ├── Rating.tsx
│   │       ├── Avatar.tsx
│   │       ├── Tag.tsx
│   │       └── Modal.tsx
│   │
│   ├── lib/                          # Utility functions
│   │   ├── api/                      # API client
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   │
│   │   ├── utils/                    # Helper functions
│   │   │   ├── format.ts             # Date, currency formatting
│   │   │   ├── validation.ts         # Form validation helpers
│   │   │   ├── storage.ts            # LocalStorage helpers
│   │   │   ├── analytics.ts          # Analytics tracking
│   │   │   └── cn.ts                 # Class name utility
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCourses.ts
│   │   │   ├── useEnrollment.ts
│   │   │   ├── useProgress.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useInfiniteScroll.ts
│   │   │
│   │   └── constants/                # Constants
│   │       ├── routes.ts
│   │       ├── categories.ts
│   │       └── config.ts
│   │
│   ├── store/                        # State management
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── courseSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── userSlice.ts
│   │   └── providers.tsx
│   │
│   ├── types/                        # TypeScript types
│   │   ├── course.ts
│   │   ├── user.ts
│   │   ├── lesson.ts
│   │   ├── quiz.ts
│   │   ├── enrollment.ts
│   │   ├── instructor.ts
│   │   └── api.ts
│   │
│   ├── schemas/                      # Validation schemas (Zod)
│   │   ├── auth.schema.ts
│   │   ├── course.schema.ts
│   │   ├── user.schema.ts
│   │   └── review.schema.ts
│   │
│   └── styles/                       # Global styles
│       ├── globals.css
│       └── themes.css
│
├── .env.local                        # Environment variables
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key Features Implementation

### 1. Homepage
```typescript
// Components needed:
- Hero section with search
- Featured courses carousel
- Course categories grid
- Top instructors
- Testimonials
- Statistics (students, courses, etc.)
- Newsletter signup
```

### 2. Course Browsing & Search
```typescript
// Features:
- Advanced filtering (category, level, rating, duration, price)
- Sort options (popularity, rating, newest, price)
- Infinite scroll or pagination
- Search autocomplete
- Recently viewed courses
```

### 3. Course Details Page
```typescript
// Sections:
- Course header (title, instructor, rating)
- Preview video
- Course description
- What you'll learn
- Course curriculum (collapsible sections)
- Requirements
- Reviews & ratings
- Instructor bio
- Related courses
- Enrollment CTA
```

### 4. Learning Interface
```typescript
// Features:
- Video player with controls
- Lesson navigation sidebar
- Progress tracking
- Notes panel
- Resources/downloads
- Quiz integration
- Discussion forum
- Next lesson auto-play
- Bookmarks
- Speed control
- Subtitles/captions
```

### 5. User Dashboard
```typescript
// Sections:
- Enrolled courses with progress
- Continue watching
- Achievements & certificates
- Learning streak
- Recommended courses
- Saved courses (wishlist)
```

### 6. Instructor Dashboard
```typescript
// Features:
- Course management (create, edit, delete)
- Student analytics
- Revenue tracking
- Reviews management
- Q&A responses
- Announcements
```

---

## Component Examples

### CourseCard Component
```typescript
interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledCount: number;
  isEnrolled?: boolean;
  progress?: number;
}
```

### VideoPlayer Component
```typescript
interface VideoPlayerProps {
  videoUrl: string;
  onProgress: (progress: number) => void;
  onComplete: () => void;
  lastWatchedPosition?: number;
  subtitles?: Subtitle[];
  quality: string[];
}
```

---

## State Management Structure

### Zustand Store Example
```typescript
// stores/courseStore.ts
interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateProgress: (lessonId: string, progress: number) => void;
}

// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

---

## API Integration

### API Service Structure
```typescript
// lib/api/courses.ts
export const coursesAPI = {
  getAll: (params?: QueryParams) => api.get('/courses', { params }),
  getById: (id: string) => api.get(`/courses/${id}`),
  enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`),
  getProgress: (courseId: string) => api.get(`/courses/${courseId}/progress`),
  updateProgress: (lessonId: string, data: ProgressData) => 
    api.put(`/lessons/${lessonId}/progress`, data),
};

// lib/api/users.ts
export const usersAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: Partial<User>) => api.put('/users/me', data),
  getEnrolledCourses: () => api.get('/users/me/courses'),
  getCertificates: () => api.get('/users/me/certificates'),
};
```

---

## TypeScript Types

### Core Types
```typescript
// types/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  previewVideo?: string;
  instructor: Instructor;
  category: Category;
  level: CourseLevel;
  duration: number; // in minutes
  price: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  curriculum: Section[];
  requirements: string[];
  learningOutcomes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
  duration?: number;
  content: string | VideoContent | QuizContent;
  resources: Resource[];
  order: number;
  isCompleted?: boolean;
  isFree?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessons: string[];
  currentLesson?: string;
  enrolledAt: Date;
  lastAccessedAt: Date;
  certificateIssued?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
  certificates: Certificate[];
  createdAt: Date;
}
```

---

## Routing Strategy

### Route Groups
```typescript
// (auth) - Authentication pages with minimal layout
// (main) - Main application with header/footer
// (instructor) - Instructor dashboard with sidebar
// (admin) - Admin panel (if needed)
```

### Protected Routes
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/my-learning');
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

---

## Styling Approach

### Tailwind Configuration
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // ... more colors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
};
```

### Component Styling Pattern
```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils/cn';

<button 
  className={cn(
    "px-4 py-2 rounded-lg font-medium transition-colors",
    variant === 'primary' && "bg-primary-600 text-white hover:bg-primary-700",
    variant === 'secondary' && "bg-gray-200 text-gray-900 hover:bg-gray-300",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
  {children}
</button>
```

---

## Performance Optimization

### Code Splitting
- Route-based splitting (automatic with Next.js)
- Dynamic imports for heavy components
- Lazy load video player

### Image Optimization
- Next.js Image component
- WebP format with fallbacks
- Responsive images
- Lazy loading

### Data Fetching
- React Query for caching
- Prefetching on hover
- Infinite scroll for lists
- Optimistic updates

---

## Responsive Design Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

---

## Testing Structure

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── user-flows/
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...
AWS_S3_BUCKET=course-videos
```

---

## Getting Started Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

---

## Additional Considerations

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

### SEO
- Meta tags
- Open Graph tags
- Structured data (JSON-LD)
- Dynamic sitemaps
- Canonical URLs

### Analytics
- Page views tracking
- Course enrollment events
- Video watch time
- User engagement metrics
- Conversion tracking

### Security
- Input sanitization
- CSRF protection
- XSS prevention
- Secure authentication
- Rate limiting
- Content Security Policy

---

This structure provides a solid foundation for building a Coursera-like platform with modern web technologies and best practices.
