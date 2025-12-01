
# Authentication Documentation

## Overview

The Educare application uses Supabase Authentication for secure user management. This document details the authentication flows, role-based access control, implementation details, and security considerations.

## Authentication Flow

### Registration and Login Process

```
┌─────────┐     ┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User   │────▶│ Email/Password │────▶│ JWT Generation  │────▶│ Access Granted  │
└─────────┘     └───────────────┘     └─────────────────┘     └─────────────────┘
                        │                       │                      │
                        │                       │                      │
                        ▼                       ▼                      ▼
                ┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
                │Create Profile │     │Role Assignment  │     │ Policy Enforcement│
                └───────────────┘     └─────────────────┘     └─────────────────┘
```

### Registration Flow

1. User provides email, password, and profile information
2. System validates input and creates user in auth.users table
3. A corresponding profile is created in educare_profiles table
4. Default roles are assigned to the user
5. A verification email is sent (if enabled)
6. User is redirected to verify email or directly to the application

### Login Flow

1. User provides email and password
2. System validates credentials against auth.users table
3. On successful validation, JWT tokens are generated:
   - Access token (short-lived)
   - Refresh token (long-lived)
4. User session is established
5. User is redirected to the main application

### Session Management

- Sessions are managed using JWT tokens
- Access tokens expire after 1 hour by default
- Refresh tokens are used to obtain new access tokens without requiring re-authentication
- Session state is maintained using Supabase's onAuthStateChange event

## Role-Based Access Control (RBAC)

### Role Hierarchy

The application implements a hierarchical role structure:

1. **super_admin**: Highest level with unrestricted access
2. **admin**: Administrative access to the platform
3. **coordinator**: Manages teams and oversees professionals
4. **professional**: Healthcare or education professional
5. **parent**: Guardian or parent of a child
6. **guest**: Limited access to public resources

### Role Implementation

Roles are implemented using a dedicated roles table rather than storing roles directly on the user profile:

```sql
-- Roles table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rank INTEGER NOT NULL,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User roles junction table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  role_id UUID REFERENCES public.roles NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  UNIQUE(user_id, role_id)
);
```

### Permission System

Permissions are assigned to roles, not directly to users:

```sql
-- Permissions table
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Role permissions junction table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.roles NOT NULL,
  permission_id UUID REFERENCES public.permissions NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);
```

### Role Checking Functions

These functions avoid recursive RLS policies:

```sql
-- Check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.roles r
    JOIN public.user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = has_role.user_id
    AND r.name = has_role.role_name
  );
END;
$$;

-- Get all roles for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TABLE(role_name TEXT, role_rank INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT r.name, r.rank
  FROM public.roles r
  JOIN public.user_roles ur ON r.id = ur.role_id
  WHERE ur.user_id = get_user_roles.user_id;
END;
$$;
```

## JWT Implementation Details

### JWT Structure

```
┌──────────────────────────────────────┐
│ Header                               │
│ {                                    │
│   "alg": "HS256",                    │
│   "typ": "JWT"                       │
│ }                                    │
├──────────────────────────────────────┤
│ Payload                              │
│ {                                    │
│   "sub": "<user_id>",                │
│   "email": "user@example.com",       │
│   "role": "parent",                  │
│   "iat": 1516239022,                 │
│   "exp": 1516242622                  │
│ }                                    │
├──────────────────────────────────────┤
│ Signature                            │
│ HMAC-SHA256(                         │
│   base64UrlEncode(header) + "." +    │
│   base64UrlEncode(payload),          │
│   secret                             │
│ )                                    │
└──────────────────────────────────────┘
```

### Client-Side JWT Management

```typescript
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// Setup auth listener
useEffect(() => {
  // Set up auth state listener first
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  // Then check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

## Password Reset Flow

1. User requests password reset via forgot password form
2. System sends password reset email with a secure token
3. User clicks the link in the email
4. System validates the token
5. User enters a new password
6. System updates the password in auth.users
7. User is redirected to login with the new password

```typescript
// Password reset request
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://example.com/reset-password',
  });
  return { success: !error, error };
};

// Update password
const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { success: !error, error };
};
```

## Row Level Security (RLS)

### Policy Pattern

The application uses RLS policies to restrict data access based on user identity:

```sql
-- Example: Access control for child records
CREATE POLICY "Users can view their own children"
ON public.educare_children
FOR SELECT
USING (auth.uid() = user_id);

-- Example: Role-based access using the has_role function
CREATE POLICY "Professionals can view assigned children"
ON public.educare_children
FOR SELECT
USING (
  public.has_role(auth.uid(), 'professional') AND 
  EXISTS (
    SELECT 1 FROM educare_professional_children
    WHERE professional_id = auth.uid() AND child_id = id
  )
);
```

### Security Considerations

1. **SECURITY DEFINER Functions**: Used with care to avoid privilege escalation
2. **Function Search Paths**: Explicitly set to 'public' to prevent search path attacks
3. **RLS Policy Precedence**: Policies are carefully ordered to prevent unintended access

## OAuth Providers

The application supports these OAuth providers:

1. **Google**: For standard consumer accounts
2. **Microsoft**: For institutional accounts
3. **Apple**: For iOS users

OAuth configuration is managed in the Supabase dashboard.

## Security Best Practices

1. **Password Requirements**:
   - Minimum 8 characters
   - Combination of letters, numbers, and special characters
   - Regular password rotation encouraged

2. **JWT Security**:
   - Short token lifetimes (60 minutes)
   - Secure storage in localStorage or sessionStorage
   - Refresh token rotation

3. **Rate Limiting**:
   - Login attempts limited to prevent brute force attacks
   - IP-based rate limiting for auth endpoints

4. **Audit Logging**:
   - Authentication events are logged
   - Failed login attempts are tracked
   - Password changes are recorded

## Deployment Configuration

For development environments:
- Email verification is typically disabled
- Password requirements may be relaxed
- Longer token lifetimes may be used

For production:
- Email verification is enabled
- Strict password policies enforced
- OAuth providers are fully configured
- Rate limiting is enforced
