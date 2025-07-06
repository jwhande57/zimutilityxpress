
/**
 * Validation Utility Module
 * Contains functions for validating Zimbabwean phone numbers, account numbers,
 * and other payment-related identifiers used throughout the application
 */

/**
 * Validate Econet Zimbabwe mobile number
 * Econet uses prefixes 077 and 078 followed by 7 digits
 * @param number - Phone number string (may contain spaces)
 * @returns true if valid Econet number, false otherwise
 */
export const validateEconetNumber = (number: string): boolean => {
  // Remove all whitespace characters for validation
  const cleanNumber = number.replace(/\s/g, '');
  
  // Pattern: (077|078) followed by exactly 7 digits
  return /^(077|078)\d{7}$/.test(cleanNumber);
};

/**
 * Validate NetOne Zimbabwe mobile number
 * NetOne uses prefix 071 followed by 7 digits
 * @param number - Phone number string (may contain spaces)
 * @returns true if valid NetOne number, false otherwise
 */
export const validateNetOneNumber = (number: string): boolean => {
  // Remove all whitespace characters for validation
  const cleanNumber = number.replace(/\s/g, '');
  
  // Pattern: 071 followed by exactly 7 digits
  return /^071\d{7}$/.test(cleanNumber);
};

/**
 * Validate any Zimbabwean mobile number (Econet or NetOne)
 * Accepts both major network prefixes
 * @param number - Phone number string (may contain spaces)
 * @returns true if valid Zimbabwean mobile number, false otherwise
 */
export const validateZimMobileNumber = (number: string): boolean => {
  // Remove all whitespace characters for validation
  const cleanNumber = number.replace(/\s/g, '');
  
  // Pattern: (077|078|071) followed by exactly 7 digits
  return /^(077|078|071)\d{7}$/.test(cleanNumber);
};

/**
 * Validate ZESA electricity meter number
 * ZESA meter numbers are typically 11 digits
 * @param number - Meter number string (may contain spaces)
 * @returns true if valid meter number, false otherwise
 */
export const validateMeterNumber = (number: string): boolean => {
  // Remove all whitespace characters for validation
  const cleanNumber = number.replace(/\s/g, '');
  
  // Pattern: exactly 11 digits
  return /^\d{11}$/.test(cleanNumber);
};

/**
 * Validate TelOne account number
 * TelOne accounts are between 6-12 digits
 * @param number - Account number string (may contain spaces)
 * @returns true if valid account number, false otherwise
 */
export const validateTelOneAccount = (number: string): boolean => {
  // Remove all whitespace characters for validation
  const cleanNumber = number.replace(/\s/g, '');
  
  // Pattern: 6 to 12 digits
  return /^\d{6,12}$/.test(cleanNumber);
};

/**
 * Validate Nyaradzo insurance policy number
 * Format: 2 uppercase letters followed by 8 digits (e.g., NY12345678)
 * @param number - Policy number string (may contain spaces)
 * @returns true if valid policy number, false otherwise
 */
export const validatePolicyNumber = (number: string): boolean => {
  // Remove all whitespace characters for validation
  const cleanNumber = number.replace(/\s/g, '');
  
  // Pattern: exactly 2 uppercase letters followed by 8 digits
  return /^[A-Z]{2}\d{8}$/.test(cleanNumber);
};

/**
 * Format phone number with spaces for better readability
 * Converts 0771234567 to "077 123 4567"
 * @param number - Raw phone number string
 * @returns Formatted phone number with spaces
 */
export const formatPhoneNumber = (number: string): string => {
  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, '');
  
  // Format with spaces if we have enough digits
  if (cleaned.length >= 3) {
    // Pattern: XXX XXX XXXX (3-3-4 format)
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  // Return cleaned number if too short to format
  return cleaned;
};
