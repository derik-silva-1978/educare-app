/**
 * Utilitários para debug de autenticação
 */

import { getStoredAuthToken, getStoredUserData } from './authStorage';

export const debugAuthStatus = () => {
  const token = getStoredAuthToken();
  const userData = getStoredUserData();
  
  console.group('🔍 Auth Debug Status');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
  console.log('User data:', userData);
  console.log('User role:', userData?.role);
  console.log('User status:', userData?.status);
  console.groupEnd();
  
  return {
    hasToken: !!token,
    userData,
    isOwnerOrAdmin: userData?.role === 'owner' || userData?.role === 'admin',
    isActive: userData?.status === 'active'
  };
};

export const testAuthEndpoint = async () => {
  const token = getStoredAuthToken();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  if (!token) {
    console.error('❌ No token available for testing');
    return false;
  }
  
  try {
    console.log('🧪 Testing auth endpoint...');
    const response = await fetch(`${API_URL}/api/subscription-plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.status === 401) {
      console.error('❌ Authentication failed - Token may be expired or invalid');
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return false;
    }
    
    if (response.status === 403) {
      console.error('❌ Authorization failed - User may not have required permissions');
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return false;
    }
    
    if (response.ok) {
      console.log('✅ Authentication successful');
      return true;
    }
    
    console.warn('⚠️ Unexpected response status:', response.status);
    return false;
    
  } catch (error) {
    console.error('❌ Network error during auth test:', error);
    return false;
  }
};
