
/**
 * Payment Reference Utility Module
 * Handles generation and validation of unique payment reference numbers
 * Format: ZMP + 8-digit timestamp + 6-character random string
 * Example: ZMP12345678ABCDEF
 */

/**
 * Generate a unique payment reference number
 * Uses timestamp and random characters to ensure uniqueness
 * @returns Unique payment reference string in format ZMP[timestamp][random]
 */
export const generatePaymentReference = (): string => {
  // Get current timestamp and extract last 8 digits for brevity
  const timestamp = Date.now().toString();
  const timestampSuffix = timestamp.slice(-8);
  
  // Generate 6-character random alphanumeric string (uppercase)
  const randomString = Math.random()
    .toString(36)           // Convert to base-36 (0-9, a-z)
    .substring(2, 8)        // Take 6 characters after "0."
    .toUpperCase();         // Convert to uppercase for consistency
  
  // Combine prefix, timestamp, and random string
  return `ZMP${timestampSuffix}${randomString}`;
};

/**
 * Validate payment reference format
 * Ensures reference follows expected pattern: ZMP + 8 digits + 6 alphanumeric chars
 * @param reference - Payment reference string to validate
 * @returns true if reference format is valid, false otherwise
 */
export const validatePaymentReference = (reference: string): boolean => {
  // Regular expression pattern:
  // ^ZMP - Must start with "ZMP"
  // \d{8} - Followed by exactly 8 digits
  // [A-Z0-9]{6}$ - Ending with exactly 6 uppercase alphanumeric characters
  const pattern = /^ZMP\d{8}[A-Z0-9]{6}$/;
  
  return pattern.test(reference);
};
