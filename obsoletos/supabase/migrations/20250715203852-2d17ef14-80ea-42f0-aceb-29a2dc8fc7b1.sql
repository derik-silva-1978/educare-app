-- Update the age field for all children based on their birthdate
-- Using the new calculation that always rounds up to the nearest month
UPDATE educare_children 
SET age = CASE 
  WHEN birthdate IS NOT NULL THEN 
    GREATEST(0, CEIL(EXTRACT(DAY FROM (CURRENT_DATE - birthdate)) / 30.44))::INTEGER
  ELSE 0 
END,
updated_at = now()
WHERE birthdate IS NOT NULL;

-- Add a trigger to automatically update age when birthdate changes
CREATE OR REPLACE FUNCTION public.update_child_age_from_birthdate()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate age in months, always rounding up
    NEW.age := CASE 
        WHEN NEW.birthdate IS NOT NULL THEN 
            GREATEST(0, CEIL(EXTRACT(DAY FROM (CURRENT_DATE - NEW.birthdate)) / 30.44))::INTEGER
        ELSE 0 
    END;
    
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS update_child_age_trigger ON educare_children;
CREATE TRIGGER update_child_age_trigger
    BEFORE INSERT OR UPDATE OF birthdate ON educare_children
    FOR EACH ROW
    EXECUTE FUNCTION public.update_child_age_from_birthdate();