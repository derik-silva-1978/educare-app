
// Supabase configuration for database tables, procedures, and other settings

// Database tables
export const tables = {
  users: 'users',
  profiles: 'profiles',
  assessments: 'assessments',
  teams: 'teams',
  licenses: 'licenses',
  reports: 'reports',
  students: 'students'
};

// Stored procedures
export const storedProcedures = {
  validateLicense: 'validate_license',
  getLicenseDetails: 'get_license_details',
  activateLicense: 'activate_license',
  createTeam: 'create_team',
  addTeamMember: 'add_team_member',
  removeTeamMember: 'remove_team_member'
};

// Email templates
export const emailTemplates = {
  welcome: 'welcome',
  passwordReset: 'password-reset',
  magicLink: 'magic-link',
  teamInvite: 'team-invite'
};

// API endpoints
export const apiEndpoints = {
  auth: '/auth',
  assessments: '/assessments',
  reports: '/reports',
  students: '/students',
  teams: '/teams',
  licenses: '/licenses'
};

// Supabase configuration
export const config = {
  url: process.env.VITE_SUPABASE_URL || 'https://ripfuvuhfbjccuvpdplf.supabase.co',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcGZ1dnVoZmJqY2N1dnBkcGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAyODk2MDAsImV4cCI6MjAxNTg2NTYwMH0.V2SB3hJJLLZBVG9ZX5e_4vz5Vhj_jG2OlKvmXERADs4'
};

export default {
  tables,
  storedProcedures,
  emailTemplates,
  apiEndpoints,
  config
};
