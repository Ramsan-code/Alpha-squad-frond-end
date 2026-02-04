# API Integration Guide & Production Checklist

## 📋 Overview

This document provides a comprehensive guide for API integration between the Next.js frontend and Express backend, including implementation patterns, testing strategies, and a production checklist.

---

## 🏗️ Folder Structure

```
src/
├── lib/
│   ├── api/                        # Core API layer
│   │   ├── index.ts               # Public API exports
│   │   ├── client.ts              # HTTP client with interceptors
│   │   ├── config.ts              # Configuration & token storage
│   │   └── types.ts               # API-related TypeScript types
│   │
│   ├── services/                   # Service layer (API wrappers)
│   │   ├── index.ts               # Service exports
│   │   ├── auth.service.ts        # Authentication endpoints
│   │   ├── courses.service.ts     # Courses endpoints
│   │   └── health.service.ts      # Health check endpoints
│   │
│   └── hooks/                      # React hooks for data fetching
│       ├── index.ts               # Hook exports
│       └── use-api.ts             # useApi, useMutation, useInfiniteScroll
│
├── types/                          # Global TypeScript types
│   ├── user.ts                    # User types
│   └── profile.ts                 # Profile types
│
└── __tests__/                      # Test files
    ├── setup.ts                   # Jest setup
    ├── api/
    │   ├── api-client.test.ts     # Unit tests for API client
    │   └── integration.test.ts    # E2E integration tests
    └── services/
        └── services.test.ts       # Service unit tests
```

---

## 🔌 Implementation Examples

### 1. GET Request Example

```typescript
import { api, ApiResponse } from '@/lib/api';
import { Course } from '@/lib/services';

// Define response type
type CoursesResponse = ApiResponse<{
  courses: Course[];
  total: number;
}>;

// Make the request
async function fetchCourses(page: number = 1): Promise<CoursesResponse> {
  return api.get<CoursesResponse>('/courses', { 
    page: String(page), 
    limit: '10' 
  });
}

// Usage in component
const { data, success } = await fetchCourses(1);
if (success) {
  console.log('Courses:', data.courses);
}
```

### 2. POST Request Example

```typescript
import { api, ApiResponse, ApiError } from '@/lib/api';

// Define request and response types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginData {
  user: { id: string; name: string; email: string };
  token: string;
}

// Make the request with proper typing
async function login(credentials: LoginRequest): Promise<LoginData> {
  const response = await api.post<ApiResponse<LoginData>>(
    '/auth/login',
    credentials
  );
  
  if (!response.success) {
    throw new Error(response.message || 'Login failed');
  }
  
  return response.data;
}

// Usage with error handling
try {
  const { user, token } = await login({ 
    email: 'user@example.com', 
    password: 'password123' 
  });
  console.log('Logged in as:', user.name);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.isAuthError()) {
      console.error('Invalid credentials');
    } else if (error.isValidationError()) {
      console.error('Validation errors:', error.errors);
    }
  }
}
```

### 3. Error Handling Patterns

```typescript
import { ApiError } from '@/lib/api';

async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
    showToast?: boolean;
  }
): Promise<T | null> {
  const { onSuccess, onError, showToast = true } = options || {};
  
  try {
    const result = await apiCall();
    onSuccess?.(result);
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle different error types
      if (error.isAuthError()) {
        // Redirect to login
        window.location.href = '/login';
      } else if (error.isForbiddenError()) {
        showToast && toast.error('You do not have permission');
      } else if (error.isValidationError()) {
        showToast && toast.error(error.message);
      } else if (error.isServerError()) {
        showToast && toast.error('Server error. Please try again later.');
      } else if (error.isNetworkError) {
        showToast && toast.error('Network error. Check your connection.');
      }
      
      onError?.(error);
    }
    return null;
  }
}
```

### 4. Using Hooks for Loading States

```typescript
import { useApi, useMutation } from '@/lib/hooks';
import { coursesService, authService } from '@/lib/services';

// GET with loading state
function CoursesPage() {
  const { data, isLoading, error, execute } = useApi(
    () => coursesService.getCourses(),
    { immediate: true }
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {data?.data.courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
      <button onClick={execute}>Refresh</button>
    </div>
  );
}

// POST with mutation
function LoginForm() {
  const { mutate, isLoading, error } = useMutation(
    (data: { email: string; password: string }) => 
      authService.login(data.email, data.password),
    {
      onSuccess: (response) => {
        tokenStorage.setToken(response.data.token);
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🧪 Running Tests

### Test Commands

```bash
# Run all tests
npm test

# Run unit tests only (no API calls)
npm run test:unit

# Run integration/E2E tests (requires live backend)
npm run test:e2e

# Run with coverage report
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

### Expected Test Outputs

#### ✅ Successful Test Run
```
PASS  src/__tests__/api/api-client.test.ts
PASS  src/__tests__/services/services.test.ts
PASS  src/__tests__/api/integration.test.ts

📊 API Status Report:
──────────────────────────────────────────────────
API URL: https://alpha-squad-back-end.vercel.app/api
Reachable: ✅ Yes
Avg Latency: 234ms

Endpoint Status:
  ✅ Health: 156ms
  ✅ Courses: 312ms
  ✅ Auth: 234ms
──────────────────────────────────────────────────

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
```

#### ❌ Failed Test Run (Backend Unreachable)
```
FAIL  src/__tests__/api/integration.test.ts
  ● Backend Connectivity › should be able to reach the backend API
    
    Expected: true
    Received: false
    
    Network error: Unable to reach the server.

📊 API Status Report:
──────────────────────────────────────────────────
API URL: https://alpha-squad-back-end.vercel.app/api
Reachable: ❌ No
Error: Network error

Endpoint Status:
  ❌ Health: timeout
  ❌ Courses: timeout
  ❌ Auth: timeout
──────────────────────────────────────────────────
```

---

## ✅ Production Checklist

### Environment Configuration

| Item | Status | Notes |
|------|--------|-------|
| `NEXT_PUBLIC_API_URL` is set | ✅ | Points to production backend |
| No hard-coded URLs in codebase | ✅ | All URLs use env vars |
| No secrets in `NEXT_PUBLIC_*` vars | ✅ | Only public config exposed |
| `.env.local` is in `.gitignore` | ✅ | Secrets not committed |

### API Client

| Item | Status | Notes |
|------|--------|-------|
| Uses environment variable for base URL | ✅ | `apiConfig.baseUrl` |
| Automatic token injection | ✅ | Via request interceptor |
| Request timeout configured | ✅ | 30 second default |
| Retry logic for GET requests | ✅ | 3 retries with backoff |
| Proper error handling | ✅ | `ApiError` class |
| TypeScript types for all responses | ✅ | Defined in types.ts |

### Error Handling

| Item | Status | Notes |
|------|--------|-------|
| Network errors caught | ✅ | `isNetworkError` flag |
| Auth errors (401) handle logout | ✅ | Token cleared on 401 |
| Validation errors have details | ✅ | `errors` array in ApiError |
| Server errors (5xx) show friendly message | ✅ | Generic user message |
| Timeout errors handled | ✅ | 408 status code |

### Type Safety

| Item | Status | Notes |
|------|--------|-------|
| All API responses typed | ✅ | `ApiResponse<T>` wrapper |
| Request payloads typed | ✅ | Service method signatures |
| Error types defined | ✅ | `ApiError`, `ApiValidationError` |
| No `any` types in API layer | ✅ | Strict TypeScript |

### Testing

| Item | Status | Notes |
|------|--------|-------|
| Unit tests for API client | ✅ | `api-client.test.ts` |
| Service layer tests | ✅ | `services.test.ts` |
| Integration tests | ✅ | `integration.test.ts` |
| Tests fail on backend unreachable | ✅ | Connectivity assertions |
| Coverage thresholds set | ✅ | 70% minimum |

---

## 🚫 Common Mistakes & How We Prevent Them

### ❌ Hard-Coded URLs

**Bad:**
```typescript
const response = await fetch('http://localhost:5000/api/courses');
```

**Good (How we do it):**
```typescript
// URL comes from environment variable
const response = await api.get('/courses');
// Internally uses: apiConfig.baseUrl + '/courses'
```

**Prevention:** The `api` client reads from `NEXT_PUBLIC_API_URL` and there are no hard-coded URLs anywhere in the API layer.

---

### ❌ Missing Error Handling

**Bad:**
```typescript
const data = await fetch('/api/data').then(r => r.json());
// If fetch fails or response is not OK, this silently fails
```

**Good (How we do it):**
```typescript
try {
  const data = await api.get('/data');
} catch (error) {
  if (error instanceof ApiError) {
    // Structured error with status code, message, and details
    console.error(`[${error.statusCode}] ${error.message}`);
  }
}
```

**Prevention:** The API client wraps all responses in try/catch and throws structured `ApiError` objects with status codes and validation details.

---

### ❌ Untyped API Responses

**Bad:**
```typescript
const response = await fetch('/api/users');
const data = await response.json(); // data is 'any'
data.users.map(u => u.name); // No type safety
```

**Good (How we do it):**
```typescript
interface UsersResponse {
  users: Array<{ id: string; name: string; email: string }>;
}

const response = await api.get<ApiResponse<UsersResponse>>('/users');
response.data.users.map(u => u.name); // ✅ Fully typed
```

**Prevention:** All service methods have explicit return types, and the `ApiResponse<T>` wrapper ensures consistent typing.

---

### ❌ No Loading States

**Bad:**
```typescript
const [data, setData] = useState([]);
useEffect(() => {
  fetchData().then(setData); // No loading indicator
}, []);
```

**Good (How we do it):**
```typescript
const { data, isLoading, error } = useApi(
  () => fetchData(),
  { immediate: true }
);

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <DataList items={data} />;
```

**Prevention:** The `useApi` and `useMutation` hooks provide built-in `isLoading`, `error`, and `isSuccess` states.

---

### ❌ Token Not Sent with Requests

**Bad:**
```typescript
// Forgot to add Authorization header
const response = await fetch('/api/protected');
```

**Good (How we do it):**
```typescript
// Token is automatically added by the request interceptor
const response = await api.get('/protected');
// Headers include: Authorization: Bearer <token>
```

**Prevention:** The API client has a request interceptor that automatically adds the `Authorization` header if a token exists in storage.

---

### ❌ No Request Timeout

**Bad:**
```typescript
// No timeout - could hang forever
const response = await fetch('/api/slow-endpoint');
```

**Good (How we do it):**
```typescript
// Built-in 30 second timeout
const response = await api.get('/slow-endpoint');

// Or custom timeout
const response = await api.get('/slow-endpoint', { timeout: 5000 });
```

**Prevention:** All requests have a default 30 second timeout configured in `apiConfig.timeout`, with AbortController handling.

---

## 📚 Quick Reference

### Import Patterns

```typescript
// Main API client
import { api, ApiError, apiConfig, tokenStorage } from '@/lib/api';

// Services
import { authService, coursesService, healthService } from '@/lib/services';

// Hooks
import { useApi, useMutation, useInfiniteScroll } from '@/lib/hooks';

// Types
import type { ApiResponse, PaginatedResponse, RequestState } from '@/lib/api';
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=https://alpha-squad-back-end.vercel.app/api

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## 🔗 Related Documentation

- [FRONTEND-ARCHITECTURE.md](./FRONTEND-ARCHITECTURE.md) - Overall frontend architecture
- [Backend README](../Alpha-squad-back-end/README.md) - Backend API documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Testing framework docs
