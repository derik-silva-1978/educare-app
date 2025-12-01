
-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'specialist', 'coordinator', 'psychologist', 'therapist', 'parent')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create Policy: Admins have full access
CREATE POLICY "Admins have full access to user_roles"
  ON public.user_roles
  USING (
    (SELECT is_admin FROM public.user_roles WHERE user_id = auth.uid())
  );

-- Create Policy: Users can view their own role
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (
    user_id = auth.uid()
  );
