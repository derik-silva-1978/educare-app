
-- Create license_validations table
CREATE TABLE IF NOT EXISTS public.license_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  is_valid BOOLEAN NOT NULL,
  message TEXT,
  error_code TEXT,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  validated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.license_validations ENABLE ROW LEVEL SECURITY;

-- Create Policy: Admins have full access
CREATE POLICY "Admins have full access to license_validations"
  ON public.license_validations
  USING (
    (SELECT is_admin FROM public.user_roles WHERE user_id = auth.uid())
  );
