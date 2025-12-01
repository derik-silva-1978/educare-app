-- Create table for development reports
CREATE TABLE public.child_development_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  age_range_months TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  answered_questions INTEGER NOT NULL,
  completion_percentage DECIMAL(5,2) NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL,
  dimension_scores JSONB NOT NULL DEFAULT '{}',
  recommendations TEXT[],
  concerns TEXT[],
  report_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'generated',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  shared_with_professionals BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.child_development_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own child reports" 
ON public.child_development_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports for their children" 
ON public.child_development_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child reports" 
ON public.child_development_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_child_development_reports_updated_at
BEFORE UPDATE ON public.child_development_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key relationships
ALTER TABLE public.child_development_reports 
ADD CONSTRAINT child_development_reports_child_id_fkey 
FOREIGN KEY (child_id) REFERENCES public.educare_children(id) ON DELETE CASCADE;

ALTER TABLE public.child_development_reports 
ADD CONSTRAINT child_development_reports_session_id_fkey 
FOREIGN KEY (session_id) REFERENCES public.journey_bot_sessions(id) ON DELETE CASCADE;