
-- Create licenses table
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('trial', 'standard', 'professional', 'enterprise', 'individual')),
  model TEXT NOT NULL CHECK (model IN ('individual', 'enterprise')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  max_users INTEGER NOT NULL DEFAULT 1,
  total_count INTEGER,
  used_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  assigned_to UUID REFERENCES auth.users(id),
  assigned_to_name TEXT,
  last_validated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Create Policy: Admins have full access
CREATE POLICY "Admins have full access to licenses"
  ON public.licenses
  USING (
    (SELECT is_admin FROM public.user_roles WHERE user_id = auth.uid())
  );

-- Create Policy: Users can view licenses assigned to them
CREATE POLICY "Users can view their assigned licenses"
  ON public.licenses
  FOR SELECT
  USING (
    assigned_to = auth.uid()
  );
