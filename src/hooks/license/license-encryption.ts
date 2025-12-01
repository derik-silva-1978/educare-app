
/**
 * This module handles the encryption and decryption of license keys and other
 * sensitive license information.
 * 
 * In a production application, you would use a proper cryptographic library
 * and secure key management system. This implementation is a simple
 * placeholder meant to demonstrate the concept.
 */

// A simple encryption key that would typically be stored in environment
// variables or a secure vault
const ENCRYPTION_KEY = 'smartpei-license-encryption-key';

/**
 * Encrypt a license key
 */
export function encryptLicenseKey(licenseKey: string): string {
  try {
    // In a real application, use a proper encryption algorithm
    // This is just a simple XOR-based obfuscation for demonstration
    const encrypted = simpleXorEncrypt(licenseKey, ENCRYPTION_KEY);
    
    // Base64 encode for storage
    return btoa(encrypted);
  } catch (error) {
    console.error('Error encrypting license key:', error);
    // Fallback to original key on error
    return licenseKey;
  }
}

/**
 * Decrypt a license key
 */
export function decryptLicenseKey(encryptedKey: string): string {
  try {
    // Check if the key is encrypted (base64 encoded)
    if (!isBase64(encryptedKey)) {
      return encryptedKey;
    }
    
    // Base64 decode
    const decoded = atob(encryptedKey);
    
    // Decrypt using the same algorithm
    return simpleXorEncrypt(decoded, ENCRYPTION_KEY);
  } catch (error) {
    console.error('Error decrypting license key:', error);
    // Return original encrypted key on error
    return encryptedKey;
  }
}

/**
 * Simple XOR-based encryption/decryption
 * Note: This is NOT secure for production use!
 */
function simpleXorEncrypt(text: string, key: string): string {
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    
    // XOR operation
    const encryptedChar = String.fromCharCode(textChar ^ keyChar);
    result += encryptedChar;
  }
  
  return result;
}

/**
 * Check if a string is base64 encoded
 */
function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

/**
 * Get a display-safe version of a license key
 * (first 8 chars + ... + last 4 chars)
 */
export function getDisplaySafeLicenseKey(licenseKey: string): string {
  if (!licenseKey) return '';
  
  // If encrypted, decrypt first
  const decrypted = isBase64(licenseKey) ? decryptLicenseKey(licenseKey) : licenseKey;
  
  if (decrypted.length <= 12) return decrypted;
  
  return `${decrypted.substring(0, 8)}...${decrypted.substring(decrypted.length - 4)}`;
}
