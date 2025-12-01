
-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('coordinator', 'parent', 'professional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create Policy: Admins have full access
CREATE POLICY "Admins have full access to team_members"
  ON public.team_members
  USING (
    (SELECT is_admin FROM public.user_roles WHERE user_id = auth.uid())
  );

-- Create Policy: Users can view teams they're members of
CREATE POLICY "Users can view teams they're members of"
  ON public.team_members
  FOR SELECT
  USING (
    user_id = auth.uid()
  );
