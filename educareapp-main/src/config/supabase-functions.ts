
/**
 * This file defines the stored procedures (PostgreSQL RPC functions) 
 * that should be created in Supabase. These will be used for working
 * with tables that may not be included in the TypeScript types.
 * 
 * IMPORTANT: This file is for documentation only. You need to run these as SQL manually in
 * the Supabase SQL Editor to create the actual functions.
 */

export const storeProcedures = {
  // Insert license validation entry
  insert_license_validation: `
CREATE OR REPLACE FUNCTION insert_license_validation(
  p_license_id UUID,
  p_is_valid BOOLEAN,
  p_message TEXT DEFAULT NULL,
  p_error_code TEXT DEFAULT NULL,
  p_validated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) RETURNS VOID AS $$
BEGIN
  INSERT INTO license_validations (
    license_id, is_valid, message, error_code, validated_at
  ) VALUES (
    p_license_id, p_is_valid, p_message, p_error_code, p_validated_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `,
  
  // Get license validation history
  get_license_validation_history: `
CREATE OR REPLACE FUNCTION get_license_validation_history(
  p_license_id UUID
) RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_agg(lv)
    FROM license_validations lv
    WHERE lv.license_id = p_license_id
    ORDER BY lv.validated_at DESC
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `,
  
  // Check if a license exists
  check_license_exists: `
CREATE OR REPLACE FUNCTION check_license_exists(
  p_license_key TEXT
) RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_agg(l.id)
    FROM licenses l
    WHERE l.key = p_license_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `,
  
  // Insert license
  insert_license: `
CREATE OR REPLACE FUNCTION insert_license(
  p_id UUID,
  p_key TEXT,
  p_type TEXT,
  p_model TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE,
  p_max_users INTEGER DEFAULT 1,
  p_total_count INTEGER DEFAULT NULL,
  p_used_count INTEGER DEFAULT 0,
  p_features TEXT[] DEFAULT '{}',
  p_is_active BOOLEAN DEFAULT TRUE,
  p_assigned_to_name TEXT DEFAULT NULL,
  p_last_validated TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS JSON AS $$
BEGIN
  INSERT INTO licenses (
    id, key, type, model, expires_at, max_users, total_count, 
    used_count, features, is_active, assigned_to_name, last_validated,
    created_at, updated_at
  ) VALUES (
    p_id, p_key, p_type, p_model, p_expires_at, p_max_users, p_total_count, 
    p_used_count, p_features, p_is_active, p_assigned_to_name, p_last_validated,
    now(), now()
  );
  
  RETURN json_build_object('id', p_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `,
  
  // Insert team
  insert_team: `
CREATE OR REPLACE FUNCTION insert_team(
  p_id UUID,
  p_license_id UUID,
  p_name TEXT,
  p_student_id TEXT,
  p_student_name TEXT,
  p_created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  p_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) RETURNS JSON AS $$
BEGIN
  INSERT INTO teams (
    id, license_id, name, student_id, student_name, created_at, updated_at
  ) VALUES (
    p_id, p_license_id, p_name, p_student_id, p_student_name, p_created_at, p_updated_at
  );
  
  RETURN json_build_object('id', p_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `,
  
  // Insert team member
  insert_team_member: `
CREATE OR REPLACE FUNCTION insert_team_member(
  p_team_id UUID,
  p_user_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_role TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO team_members (
    team_id, user_id, name, email, role, created_at, updated_at
  ) VALUES (
    p_team_id, p_user_id, p_name, p_email, p_role, now(), now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

export default storeProcedures;
