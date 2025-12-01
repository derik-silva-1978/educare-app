
# Database Schema

## Overview

The Educare app uses a PostgreSQL database hosted on Supabase. This document outlines the complete database schema, including tables, relationships, constraints, and security policies.

## Core Tables

### User-Related Tables

#### educare_profiles
```sql
CREATE TABLE public.educare_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### roles
```sql
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rank INTEGER NOT NULL,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### user_roles
```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role_id UUID REFERENCES public.roles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  UNIQUE(user_id, role_id)
);
```

#### permissions
```sql
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### role_permissions
```sql
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.roles(id) NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);
```

#### app_environments
```sql
CREATE TABLE public.app_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  access_level INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### role_environment_access
```sql
CREATE TABLE public.role_environment_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.roles(id) NOT NULL,
  environment_id UUID REFERENCES public.app_environments(id) NOT NULL,
  can_access BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Child Management

#### educare_children
```sql
CREATE TABLE public.educare_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  birthdate DATE NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT,
  bloodtype TEXT,
  nationality TEXT,
  cpf TEXT,
  city TEXT,
  observations TEXT,
  journey_progress INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### educare_professional_children
```sql
CREATE TABLE public.educare_professional_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Health Records

#### maternal_health_records
```sql
CREATE TABLE public.maternal_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight NUMERIC,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  blood_glucose NUMERIC,
  temperature NUMERIC,
  sleep_hours NUMERIC,
  mood TEXT,
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### pregnancy_tracking
```sql
CREATE TABLE public.pregnancy_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  due_date DATE NOT NULL,
  last_period_date DATE NOT NULL,
  pregnancy_week INTEGER,
  high_risk BOOLEAN DEFAULT false,
  medical_conditions TEXT[],
  medications TEXT[],
  healthcare_provider TEXT,
  next_appointment DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### child_health_records
```sql
CREATE TABLE public.child_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  record_type VARCHAR NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### child_diary_entries
```sql
CREATE TABLE public.child_diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR,
  photos TEXT[],
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Quiz System

#### age_groups
```sql
CREATE TABLE public.age_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### development_phases
```sql
CREATE TABLE public.development_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_group_id UUID REFERENCES public.age_groups(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  icon_class TEXT,
  min_months INTEGER,
  max_months INTEGER,
  bg_color TEXT DEFAULT '#0c1445',
  border_color TEXT DEFAULT '#4c5eaf',
  color_class TEXT DEFAULT 'text-blue-400',
  badge_name TEXT DEFAULT 'Phase',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### quiz_questions
```sql
CREATE TYPE public.quiz_domain AS ENUM (
  'motor', 
  'cognitive', 
  'language', 
  'social', 
  'sensory', 
  'emotional'
);

CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES public.development_phases(id),
  question_text TEXT NOT NULL,
  domain quiz_domain NOT NULL,
  importance_note TEXT,
  positive_feedback_title TEXT NOT NULL,
  positive_feedback_tips TEXT[] NOT NULL,
  negative_feedback_title TEXT NOT NULL,
  negative_feedback_tips TEXT[] NOT NULL,
  order_index INTEGER NOT NULL,
  week_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### user_quiz_progress
```sql
CREATE TABLE public.user_quiz_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id),
  answer BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### video_suggestions
```sql
CREATE TABLE public.video_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.quiz_questions(id),
  title TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### video_favorites
```sql
CREATE TABLE public.video_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES public.video_suggestions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### week_milestones
```sql
CREATE TABLE public.week_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES public.development_phases(id),
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  theme_color TEXT NOT NULL,
  status TEXT DEFAULT 'locked',
  total_questions INTEGER DEFAULT 0,
  completed_questions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### user_phase_progress
```sql
CREATE TABLE public.user_phase_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  phase_id UUID REFERENCES public.development_phases(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Relationships and Constraints

### User-Role Relationships
- Each user can have multiple roles (through user_roles)
- Each role can have multiple permissions (through role_permissions)
- Role hierarchy is maintained through the rank field

### Child-User Relationships
- Each child belongs to a user (parent)
- Children can be associated with professional users (through educare_professional_children)
- Child records link to health records and diary entries

### Quiz System Relationships
- Age groups contain development phases
- Phases contain questions
- Questions link to video suggestions
- User progress tracks answers to questions
- User phase progress tracks completion of phases

## Row Level Security (RLS)

RLS policies ensure users can only access appropriate data:

### educare_children
```sql
ALTER TABLE public.educare_children ENABLE ROW LEVEL SECURITY;

-- Parents can access their own children
CREATE POLICY "Users can view their own children"
ON public.educare_children
FOR SELECT
USING (auth.uid() = user_id);

-- Professionals can access assigned children
CREATE POLICY "Professionals can view assigned children"
ON public.educare_children
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM educare_professional_children
    WHERE professional_id = auth.uid() 
    AND child_id = id
    AND status = 'approved'
  )
);
```

### maternal_health_records
```sql
ALTER TABLE public.maternal_health_records ENABLE ROW LEVEL SECURITY;

-- Users can only access their own health records
CREATE POLICY "Users can view their own health records"
ON public.maternal_health_records
FOR ALL
USING (auth.uid() = user_id);
```

### user_quiz_progress
```sql
ALTER TABLE public.user_quiz_progress ENABLE ROW LEVEL SECURITY;

-- Users can view and modify their own quiz progress
CREATE POLICY "Users can manage their own quiz progress"
ON public.user_quiz_progress
FOR ALL
USING (auth.uid() = user_id);

-- Professionals can view quiz progress for assigned children
CREATE POLICY "Professionals can view quiz progress for assigned children"
ON public.user_quiz_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM educare_professional_children
    WHERE professional_id = auth.uid() 
    AND child_id = user_quiz_progress.child_id
    AND status = 'approved'
  )
);
```

## Database Functions

### Role Management Functions

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

-- Check if user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
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
    WHERE ur.user_id = is_super_admin.user_id
    AND r.name = 'super_admin'
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

-- Check if user is an admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.educare_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

### Pregnancy Functions

```sql
-- Calculate pregnancy week based on last period date
CREATE OR REPLACE FUNCTION public.calculate_pregnancy_week()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.pregnancy_week := FLOOR(EXTRACT(DAYS FROM (CURRENT_DATE - NEW.last_period_date)) / 7);
    RETURN NEW;
END;
$$;

-- Create trigger to auto-calculate pregnancy week
CREATE TRIGGER calculate_pregnancy_week_trigger
BEFORE INSERT OR UPDATE ON public.pregnancy_tracking
FOR EACH ROW
EXECUTE FUNCTION public.calculate_pregnancy_week();
```

## Indexes

Strategic indexes to improve query performance:

```sql
-- Child lookup by user
CREATE INDEX idx_educare_children_user_id ON public.educare_children(user_id);

-- Professional-child relationships
CREATE INDEX idx_professional_children_professional ON public.educare_professional_children(professional_id);
CREATE INDEX idx_professional_children_child ON public.educare_professional_children(child_id);

-- Quiz questions by phase
CREATE INDEX idx_quiz_questions_phase_id ON public.quiz_questions(phase_id);

-- User progress by user and child
CREATE INDEX idx_user_quiz_progress_user_child ON public.user_quiz_progress(user_id, child_id);

-- Health records by user
CREATE INDEX idx_maternal_health_records_user_id ON public.maternal_health_records(user_id);
CREATE INDEX idx_maternal_health_records_date ON public.maternal_health_records(date);

-- Child health records
CREATE INDEX idx_child_health_records_child_id ON public.child_health_records(child_id);
CREATE INDEX idx_child_health_records_date ON public.child_health_records(date);

-- User roles
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
```

## Access Patterns

The database schema is optimized for these common access patterns:

### Parent Users
- View and manage their children
- Track child development through quizzes
- Record health information
- Maintain diary entries

### Professional Users
- Access assigned children records
- View developmental progress
- Add professional observations
- Recommend interventions

### Admin Users
- Manage quiz content
- Oversee user management
- View system analytics
- Configure application settings

## Performance Considerations

1. **Query Optimization**
   - Use appropriate indexes for frequent queries
   - Select only required columns
   - Use pagination for large datasets

2. **Table Partitioning**
   - Consider partitioning large tables by date
   - Especially useful for health records and diary entries

3. **Vacuum and Maintenance**
   - Regular VACUUM operations
   - Monitor table bloat
   - Update statistics regularly

## Database Evolution

As the application evolves, follow these guidelines for schema changes:

1. **Migration Strategy**
   - Use versioned migrations
   - Avoid destructive changes when possible
   - Test migrations in staging environment first

2. **Backward Compatibility**
   - Add new columns as nullable
   - Use database functions to abstract changes
   - Maintain view compatibility

3. **Data Integrity**
   - Add appropriate constraints
   - Include validation triggers
   - Enforce referential integrity

## Backup and Recovery

The database backup strategy includes:

1. **Regular Backups**
   - Daily full backups
   - Point-in-time recovery enabled
   - Backup retention policy of 30 days

2. **Disaster Recovery**
   - Regular restore testing
   - Documented recovery procedures
   - Recovery time objectives (RTO) defined

## Security Considerations

Beyond RLS policies, additional security measures include:

1. **Data Encryption**
   - Sensitive health data encryption
   - Secure password storage
   - Transport encryption

2. **Access Control**
   - Principle of least privilege
   - Regular access reviews
   - Audit logging of sensitive operations

3. **SQL Injection Prevention**
   - Parameterized queries
   - Input validation
   - Prepared statements
