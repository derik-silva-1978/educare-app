
-- Fix the health_metrics_summary view with proper type casting
CREATE OR REPLACE VIEW health_metrics_summary AS
SELECT 
  chr.id,
  chr.child_id,
  chr.user_id,
  chr.date,
  chr.record_type,
  chr.name,
  chr.height,
  chr.weight,
  chr.temperature,
  chr.head_circumference,
  chr.measurements,
  ec.first_name,
  ec.last_name,
  ec.birthdate,
  (EXTRACT(DAYS FROM (chr.date::date - ec.birthdate::date))::numeric / 30.44) as age_months
FROM child_health_records chr
JOIN educare_children ec ON chr.child_id = ec.id
WHERE chr.record_type = 'growth';
