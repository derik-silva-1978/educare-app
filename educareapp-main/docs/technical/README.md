
# Technical Documentation

## Architecture Overview

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query + Context API
- **Form Handling**: React Hook Form + Zod
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Management**: date-fns
- **Motion**: Framer Motion
- **Routing**: React Router DOM

### Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- Real-time subscriptions
- Authentication system
- File storage
- Edge Functions
- Database functions

## System Architecture

```
┌────────────────────────────┐
│      Client Application    │
│                            │
│   ┌──────────────────────┐ │
│   │        React UI      │ │
│   └──────────┬───────────┘ │
│              │             │
│   ┌──────────┴───────────┐ │
│   │     State Managment  │ │
│   │  (Context + TanStack) │ │
│   └──────────┬───────────┘ │
│              │             │
│   ┌──────────┴───────────┐ │
│   │ Supabase Client API  │ │
│   └──────────────────────┘ │
└───────────┬────────────────┘
            │
┌───────────┴────────────────┐
│     Supabase Backend       │
│                            │
│  ┌──────────────────────┐  │
│  │  Authentication      │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  PostgreSQL Database │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  Storage             │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  Edge Functions      │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

## Implementation Details

### Module Organization

The application is organized into several core modules:

1. **Authentication**: User login, registration, and session management
2. **Quiz System**: Development assessments and tracking
3. **Child Management**: Child profiles and progress tracking
4. **Professional Tools**: Assessment and intervention planning
5. **Maternal Health**: Pregnancy and health monitoring

### State Management

The application uses a hybrid approach to state management:

#### Global State
- **Authentication Context**: Manages user authentication state
- **Theme Context**: Manages application theme preferences
- **Child Context**: Provides selected child data to components

```typescript
// Authentication context example
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### Server State
- **TanStack Query**: Manages server data fetching, caching, and synchronization
- Key queries:
  - `useChildrenQuery`: Fetches and caches child data
  - `useQuizData`: Manages quiz questions and responses
  - `useAssessmentData`: Handles assessment data

```typescript
// TanStack Query example
export function useChildrenQuery() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educare_children')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}
```

#### Form State
- **React Hook Form**: Manages form state and validation
- **Zod**: Provides schema validation for form data

```typescript
// Form state example with Zod validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthdate: z.date(),
  gender: z.enum(["male", "female", "other"]),
});

export function ChildForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "other",
    },
  });
  
  // Form handling implementation
}
```

#### Local State
- **useState/useReducer**: For component-specific state

### Data Flow

1. User interaction triggers action
2. Action processed by relevant handler
3. Data validated and transformed
4. API request made if needed
5. State updated accordingly
6. UI re-rendered with new data

```
User Input → Form Validation → API Request → State Update → UI Update
```

### Component Architecture

The application uses a composable component architecture:

1. **UI Components**: Base UI elements from shadcn/ui
2. **Composite Components**: Combines UI components with business logic
3. **Page Components**: Handles routing and layout
4. **Layout Components**: Provides consistent page structure

```
layouts/
  ├─ AppLayout.tsx         # Main application layout
  └─ AuthLayout.tsx        # Authentication pages layout
components/
  ├─ ui/                   # Base UI components (shadcn)
  ├─ quiz/                 # Quiz system components
  ├─ children/             # Child management components
  ├─ assessment/           # Assessment components
  └─ titibot/              # AI assistant components
```

### Database Schema

The application uses several key tables in the Supabase database:

1. **User-related tables**:
   - profiles
   - roles
   - user_roles

2. **Child management**:
   - educare_children
   - educare_professional_children

3. **Quiz system**:
   - age_groups
   - development_phases
   - quiz_questions
   - user_quiz_progress
   - video_suggestions

4. **Health monitoring**:
   - maternal_health_records
   - pregnancy_tracking
   - child_health_records

See [Database Schema](database.md) for complete details.

### Security

The application implements several security measures:

1. **Authentication**:
   - JWT-based authentication
   - Secure session management
   - Password policies and reset flows

2. **Authorization**:
   - Row Level Security (RLS)
   - Role-based access control (RBAC)
   - Function-based permission checks

3. **Data Protection**:
   - Secure data storage
   - Input validation
   - SQL injection prevention

See [Authentication](auth.md) for authentication details.

### API Integration

The application interfaces with several APIs:

1. **Supabase API**: Core data and authentication
2. **Edge Functions**: Custom backend logic
3. **OpenAI API**: AI-powered assistance (used by Titibot)

See [API Documentation](api.md) for detailed API information.

### Error Handling

The application implements a consistent error handling strategy:

1. **API Error Handling**:
   - TanStack Query error boundaries
   - Typed error responses
   - Fallback UI states

2. **Form Validation Errors**:
   - Zod schema validation
   - Inline error messages
   - Field-level error states

3. **Global Error Handling**:
   - Error boundaries
   - Toast notifications
   - Fallback UI

```typescript
// Error handling example
const { data, error, isLoading } = useSomeQuery();

if (isLoading) return <LoadingSpinner />;

if (error) {
  return (
    <ErrorDisplay
      title="Failed to load data"
      message={error.message}
      retry={() => queryClient.invalidateQueries({ queryKey: ['someData'] })}
    />
  );
}

// Render data when available
return <DataDisplay data={data} />;
```

### Performance Optimization

The application employs several performance optimization techniques:

1. **Code Splitting**:
   - Route-based code splitting
   - Dynamic imports for large components

2. **Memoization**:
   - React.memo for expensive components
   - useMemo and useCallback hooks

3. **Virtualization**:
   - Virtualized lists for large datasets

4. **Query Optimization**:
   - Efficient query patterns
   - Data prefetching
   - Stale-while-revalidate caching

### Routing and Navigation

The application uses React Router for navigation:

```typescript
// Main routing setup
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/educare-app" element={<ProtectedRoute element={<AppLayout />} />}>
        <Route index element={<Dashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="health" element={<MaternalHealthPage />} />
      </Route>
    </Routes>
  );
}
```

### Theming and Styling

The application uses Tailwind CSS with theme customization:

1. **Global Styles**: Define base styling and theme colors
2. **Component Styles**: Composed using Tailwind utility classes
3. **Dynamic Theming**: Theme contextual styling
4. **Dark Mode Support**: Built-in dark mode

```typescript
// Theme context example
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Testing Strategy

The application follows a comprehensive testing approach:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete user flows

See [Testing Strategy](testing.md) for detailed testing information.

## Deployment Architecture

The application is deployed using the following architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Vercel       │────▶│    Supabase     │────▶│   PostgreSQL    │
│ (Frontend Host) │     │ (Backend/API)   │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Frontend**: Hosted on Vercel
   - Automatic deployments from Git
   - Preview environments
   - Edge CDN

2. **Backend**: Supabase
   - API and database services
   - Authentication services
   - Storage services
   - Edge Functions

## Development Workflow

The development workflow follows these steps:

1. **Feature Planning**:
   - Define requirements
   - Create designs
   - Plan implementation

2. **Development**:
   - Develop features
   - Write tests
   - Review code

3. **Deployment**:
   - Stage for testing
   - Deploy to production
   - Monitor performance

## Troubleshooting Guide

For common issues and their solutions:

1. **Authentication Issues**:
   - Verify Supabase API keys
   - Check RLS policies
   - Confirm proper session handling

2. **Data Loading Problems**:
   - Check network requests
   - Verify query parameters
   - Test API endpoints directly

3. **Performance Problems**:
   - Profile component renders
   - Review query optimization
   - Check bundle size

## Future Enhancements

Planned technical improvements include:

1. **Performance Optimization**:
   - Server-side rendering for initial load
   - Improved bundling strategy
   - Query optimization

2. **Enhanced Features**:
   - Offline support
   - Push notifications
   - Advanced analytics

3. **User Experience**:
   - Accessibility improvements
   - Mobile optimization
   - Animation enhancements

For more specific documentation:
- [Database Schema](database.md)
- [API Documentation](api.md)
- [Authentication](auth.md)
- [Testing Strategy](testing.md)
