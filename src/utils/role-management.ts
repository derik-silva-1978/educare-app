
// Temporarily disabled - references non-existent role system tables
// The role system is handled through the educare_profiles.role field

export async function assignRoleToUser() {
  console.log('Role assignment temporarily disabled - roles are managed through educare_profiles');
  return { success: false, error: 'Role system temporarily disabled' };
}

export async function removeRoleFromUser() {
  console.log('Role removal temporarily disabled - roles are managed through educare_profiles');
  return { success: false, error: 'Role system temporarily disabled' };
}
