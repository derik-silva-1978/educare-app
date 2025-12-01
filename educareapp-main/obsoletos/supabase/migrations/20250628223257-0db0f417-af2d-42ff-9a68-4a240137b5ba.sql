
-- Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Users can view their own children" ON public.educare_children;
DROP POLICY IF EXISTS "Users can insert their own children" ON public.educare_children;
DROP POLICY IF EXISTS "Users can update their own children" ON public.educare_children;
DROP POLICY IF EXISTS "Users can delete their own children" ON public.educare_children;

-- Enable RLS on educare_children table
ALTER TABLE public.educare_children ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own children
CREATE POLICY "Users can view their own children" ON public.educare_children
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own children
CREATE POLICY "Users can insert their own children" ON public.educare_children
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own children
CREATE POLICY "Users can update their own children" ON public.educare_children
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own children
CREATE POLICY "Users can delete their own children" ON public.educare_children
FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for journey_bot_sessions if they exist
DROP POLICY IF EXISTS "Users can view their own journey bot sessions" ON public.journey_bot_sessions;
DROP POLICY IF EXISTS "Users can insert their own journey bot sessions" ON public.journey_bot_sessions;
DROP POLICY IF EXISTS "Users can update their own journey bot sessions" ON public.journey_bot_sessions;
DROP POLICY IF EXISTS "Users can delete their own journey bot sessions" ON public.journey_bot_sessions;

-- Enable RLS on journey_bot_sessions table
ALTER TABLE public.journey_bot_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own journey bot sessions
CREATE POLICY "Users can view their own journey bot sessions" ON public.journey_bot_sessions
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own journey bot sessions
CREATE POLICY "Users can insert their own journey bot sessions" ON public.journey_bot_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own journey bot sessions
CREATE POLICY "Users can update their own journey bot sessions" ON public.journey_bot_sessions
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own journey bot sessions
CREATE POLICY "Users can delete their own journey bot sessions" ON public.journey_bot_sessions
FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for journey_bot_responses if they exist
DROP POLICY IF EXISTS "Users can view their own journey bot responses" ON public.journey_bot_responses;
DROP POLICY IF EXISTS "Users can insert their own journey bot responses" ON public.journey_bot_responses;
DROP POLICY IF EXISTS "Users can update their own journey bot responses" ON public.journey_bot_responses;
DROP POLICY IF EXISTS "Users can delete their own journey bot responses" ON public.journey_bot_responses;

-- Enable RLS on journey_bot_responses table
ALTER TABLE public.journey_bot_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own journey bot responses
CREATE POLICY "Users can view their own journey bot responses" ON public.journey_bot_responses
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own journey bot responses
CREATE POLICY "Users can insert their own journey bot responses" ON public.journey_bot_responses
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own journey bot responses
CREATE POLICY "Users can update their own journey bot responses" ON public.journey_bot_responses
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own journey bot responses
CREATE POLICY "Users can delete their own journey bot responses" ON public.journey_bot_responses
FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for journey_bot_achievements if they exist
DROP POLICY IF EXISTS "Users can view their own journey bot achievements" ON public.journey_bot_achievements;
DROP POLICY IF EXISTS "Users can insert their own journey bot achievements" ON public.journey_bot_achievements;
DROP POLICY IF EXISTS "Users can update their own journey bot achievements" ON public.journey_bot_achievements;
DROP POLICY IF EXISTS "Users can delete their own journey bot achievements" ON public.journey_bot_achievements;

-- Enable RLS on journey_bot_achievements table
ALTER TABLE public.journey_bot_achievements ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own journey bot achievements
CREATE POLICY "Users can view their own journey bot achievements" ON public.journey_bot_achievements
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own journey bot achievements
CREATE POLICY "Users can insert their own journey bot achievements" ON public.journey_bot_achievements
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own journey bot achievements
CREATE POLICY "Users can update their own journey bot achievements" ON public.journey_bot_achievements
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own journey bot achievements
CREATE POLICY "Users can delete their own journey bot achievements" ON public.journey_bot_achievements
FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for journey_bot_questions if they exist
DROP POLICY IF EXISTS "Authenticated users can view journey bot questions" ON public.journey_bot_questions;

-- Enable RLS on journey_bot_questions table (public read access for all authenticated users)
ALTER TABLE public.journey_bot_questions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view journey bot questions
CREATE POLICY "Authenticated users can view journey bot questions" ON public.journey_bot_questions
FOR SELECT USING (auth.role() = 'authenticated');

-- Drop existing policies for child_diary_entries if they exist
DROP POLICY IF EXISTS "Users can view their own child diary entries" ON public.child_diary_entries;
DROP POLICY IF EXISTS "Users can insert their own child diary entries" ON public.child_diary_entries;
DROP POLICY IF EXISTS "Users can update their own child diary entries" ON public.child_diary_entries;
DROP POLICY IF EXISTS "Users can delete their own child diary entries" ON public.child_diary_entries;

-- Create policy for child_diary_entries table
ALTER TABLE public.child_diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own child diary entries" ON public.child_diary_entries
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own child diary entries" ON public.child_diary_entries
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child diary entries" ON public.child_diary_entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own child diary entries" ON public.child_diary_entries
FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for child_health_records if they exist
DROP POLICY IF EXISTS "Users can view their own child health records" ON public.child_health_records;
DROP POLICY IF EXISTS "Users can insert their own child health records" ON public.child_health_records;
DROP POLICY IF EXISTS "Users can update their own child health records" ON public.child_health_records;
DROP POLICY IF EXISTS "Users can delete their own child health records" ON public.child_health_records;

-- Create policy for child_health_records table
ALTER TABLE public.child_health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own child health records" ON public.child_health_records
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own child health records" ON public.child_health_records
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child health records" ON public.child_health_records
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own child health records" ON public.child_health_records
FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for child_anamnese if they exist
DROP POLICY IF EXISTS "Users can view their own child anamnese" ON public.child_anamnese;
DROP POLICY IF EXISTS "Users can insert their own child anamnese" ON public.child_anamnese;
DROP POLICY IF EXISTS "Users can update their own child anamnese" ON public.child_anamnese;
DROP POLICY IF EXISTS "Users can delete their own child anamnese" ON public.child_anamnese;

-- Create policy for child_anamnese table
ALTER TABLE public.child_anamnese ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own child anamnese" ON public.child_anamnese
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own child anamnese" ON public.child_anamnese
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child anamnese" ON public.child_anamnese
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own child anamnese" ON public.child_anamnese
FOR DELETE USING (auth.uid() = user_id);
