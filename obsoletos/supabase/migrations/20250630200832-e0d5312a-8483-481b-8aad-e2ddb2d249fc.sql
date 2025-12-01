
-- First, let's recreate the app_role enum to make sure it exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role as enum ('admin', 'teacher', 'therapist', 'coordinator', 'parent', 'student', 'guest', 'specialist', 'psychologist', 'professional', 'manager');
    END IF;
END $$;

-- Drop and recreate the handle_new_user function with better error handling
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role text;
    user_first_name text;
    user_last_name text;
    user_name text;
BEGIN
    -- Extract metadata safely with defaults
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'parent');
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', '');
    
    -- If name is provided but first_name/last_name are not, split the name
    IF user_name != '' AND user_first_name = '' AND user_last_name = '' THEN
        user_first_name := split_part(user_name, ' ', 1);
        user_last_name := CASE 
            WHEN array_length(string_to_array(user_name, ' '), 1) > 1 
            THEN substring(user_name from length(split_part(user_name, ' ', 1)) + 2)
            ELSE ''
        END;
    END IF;
    
    -- Ensure we have at least a first name
    IF user_first_name = '' THEN
        user_first_name := split_part(NEW.email, '@', 1);
    END IF;
    
    -- Validate and cast role
    IF user_role NOT IN ('admin', 'teacher', 'therapist', 'coordinator', 'parent', 'student', 'guest', 'specialist', 'psychologist', 'professional', 'manager') THEN
        user_role := 'parent';
    END IF;
    
    -- Insert into profiles table
    INSERT INTO public.educare_profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        user_first_name,
        user_last_name,
        user_role::app_role
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on educare_profiles if not already enabled
ALTER TABLE public.educare_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for educare_profiles if they don't exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.educare_profiles;
CREATE POLICY "Users can view own profile" ON public.educare_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.educare_profiles;
CREATE POLICY "Users can update own profile" ON public.educare_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow insert during user creation (will be handled by trigger)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.educare_profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.educare_profiles
    FOR INSERT WITH CHECK (true);
