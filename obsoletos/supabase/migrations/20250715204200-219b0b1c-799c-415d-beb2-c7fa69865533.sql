-- First, let's update the age based on a simpler calculation
-- Calculate months between birthdate and current date, always rounding up
UPDATE educare_children 
SET age = CASE 
  WHEN birthdate IS NOT NULL THEN 
    GREATEST(0, 
      (EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM birthdate)) * 12 +
      (EXTRACT(MONTH FROM CURRENT_DATE) - EXTRACT(MONTH FROM birthdate)) +
      CASE WHEN EXTRACT(DAY FROM CURRENT_DATE) >= EXTRACT(DAY FROM birthdate) THEN 1 ELSE 0 END
    )::INTEGER
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
            GREATEST(0, 
              (EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM NEW.birthdate)) * 12 +
              (EXTRACT(MONTH FROM CURRENT_DATE) - EXTRACT(MONTH FROM NEW.birthdate)) +
              CASE WHEN EXTRACT(DAY FROM CURRENT_DATE) >= EXTRACT(DAY FROM NEW.birthdate) THEN 1 ELSE 0 END
            )::INTEGER
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