/**
 * Local Storage Management Module
 * Handles persistent storage of payment data in browser's localStorage
 * Provides CRUD operations for payment records with error handling
 */

/**
 * StoredPayment Interface - Structure for payment data stored locally
 * Extends basic payment info with status tracking and completion details
 */
interface StoredPayment {
  reference: string;                    // Unique payment reference used to identify each payment
  service: string;                      // Service name associated with the payment (e.g., "Econet Airtime")
  amount: number;                       // Payment amount in USD
  customerData: Record<string, any>;    // Flexible object storing service-specific customer details
  timestamp: string;                    // ISO string representing when the payment was created
  status?: 'pending' | 'success' | 'failed';  // Optional payment status (pending, success, or failed)
  transactionId?: string;               // Optional external transaction ID from payment processor
  completedAt?: string;                 // Optional ISO string of when the payment was completed
}

/**
 * Local Storage Manager Object
 * Contains all functions for managing payment data in localStorage
 */
export const localStorageManager = {
  /**
   * Save payment data to localStorage
   * @param payment - Payment data to store
   * @returns true if saved successfully, false if failed
   */
  savePayment: (payment: StoredPayment): boolean => {  // Define function to save a payment, takes StoredPayment type, returns boolean
    try {                                      // Start try block to handle potential errors
      const key = `payment_${payment.reference}`;  // Create a unique key by prefixing "payment_" to the reference
      const serializedData = JSON.stringify(payment);  // Convert payment object to JSON string for storage
      localStorage.setItem(key, serializedData);  // Store the serialized payment data in localStorage using the key
      console.log('Payment saved to localStorage:', payment);  // Log success message with payment details for debugging
      return true;                             // Return true to indicate successful save
    } catch (error) {                          // Catch any errors that occur during the save process
      console.error('Failed to save payment to localStorage:', error);  // Log error message with details
      return false;                            // Return false to indicate save failure
    }
  },

  /**
   * Retrieve payment data from localStorage
   * @param reference - Payment reference to look up
   * @returns Payment data if found, null if not found or error
   */
  getPayment: (reference: string): StoredPayment | null => {  // Define function to get payment by reference, returns StoredPayment or null
    try {                                      // Start try block to handle potential errors
      const key = `payment_${reference}`;      // Construct the key using the provided reference
      const stored = localStorage.getItem(key);  // Retrieve the serialized data from localStorage
      if (!stored) return null;                // Check if data exists; return null if not found
      const payment = JSON.parse(stored);      // Parse the JSON string back into a payment object
      console.log('Payment retrieved from localStorage:', payment);  // Log success message with payment details
      return payment;                          // Return the retrieved payment object
    } catch (error) {                          // Catch any errors during retrieval or parsing
      console.error('Failed to retrieve payment from localStorage:', error);  // Log error message with details
      return null;                             // Return null to indicate retrieval failure
    }
  },

  /**
   * Update payment status (success/failed) and add transaction ID
   * @param reference - Payment reference to update
   * @param status - New status ('success' or 'failed')
   * @param transactionId - Optional transaction ID from payment processor
   * @returns true if updated successfully, false if failed
   */
  updatePaymentStatus: (reference: string, status: 'success' | 'failed', transactionId?: string): boolean => {  // Define function to update payment status
    try {                                      // Start try block to handle potential errors
      const payment = localStorageManager.getPayment(reference);  // Retrieve existing payment using reference
      if (!payment) return false;              // Check if payment exists; return false if not found
      const updatedPayment = {                 // Create a new payment object with updated details
        ...payment,                            // Spread existing payment properties
        status,                                // Update status with new value
        transactionId,                         // Add or update transactionId (optional)
        completedAt: new Date().toISOString()  // Set completion timestamp to current time in ISO format
      };
      return localStorageManager.savePayment(updatedPayment);  // Save updated payment and return result
    } catch (error) {                          // Catch any errors during update process
      console.error('Failed to update payment status:', error);  // Log error message with details
      return false;                            // Return false to indicate update failure
    }
  },

  /**
   * Get all stored payments sorted by creation time (newest first)
   * @returns Array of all stored payments
   */
  getAllPayments: (): StoredPayment[] => {    // Define function to retrieve all payments, returns array
    try {                                     // Start try block to handle potential errors
      const payments: StoredPayment[] = [];   // Initialize empty array to store payments
      for (let i = 0; i < localStorage.length; i++) {  // Loop through all keys in localStorage
        const key = localStorage.key(i);      // Get key at current index
        if (key && key.startsWith('payment_')) {  // Check if key exists and is a payment key
          const reference = key.replace('payment_', '');  // Extract reference by removing prefix
          const payment = localStorageManager.getPayment(reference);  // Retrieve payment using reference
          if (payment) payments.push(payment);  // Add payment to array if successfully retrieved
        }
      }
      return payments.sort((a, b) =>         // Sort payments by timestamp, newest first
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()  // Compare timestamps numerically
      );
    } catch (error) {                         // Catch any errors during retrieval or sorting
      console.error('Failed to get all payments:', error);  // Log error message with details
      return [];                              // Return empty array to indicate failure
    }
  },

  /**
   * Clean up old payments (older than 30 days) to manage storage space
   * @returns Number of payments cleaned up
   */
  cleanupOldPayments: (): number => {         // Define function to clean old payments, returns count
    try {                                     // Start try block to handle potential errors
      const thirtyDaysAgo = new Date();       // Create Date object for current time
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);  // Set date to 30 days ago
      let cleanedCount = 0;                   // Initialize counter for cleaned payments
      const keysToRemove: string[] = [];      // Initialize array to store keys to remove
      for (let i = 0; i < localStorage.length; i++) {  // Loop through all keys in localStorage
        const key = localStorage.key(i);      // Get key at current index
        if (key && key.startsWith('payment_')) {  // Check if key exists and is a payment key
          const reference = key.replace('payment_', '');  // Extract reference from key
          const payment = localStorageManager.getPayment(reference);  // Retrieve payment
          if (payment && new Date(payment.timestamp) < thirtyDaysAgo) {  // Check if payment is older than 30 days
            keysToRemove.push(key);            // Add key to removal list
          }
        }
      }
      keysToRemove.forEach(key => {           // Iterate through keys marked for removal
        localStorage.removeItem(key);         // Remove payment from localStorage
        cleanedCount++;                       // Increment counter
      });
      console.log(`Cleaned up ${cleanedCount} old payments`);  // Log number of payments cleaned
      return cleanedCount;                    // Return number of payments removed
    } catch (error) {                         // Catch any errors during cleanup
      console.error('Failed to cleanup old payments:', error);  // Log error message with details
      return 0;                               // Return 0 to indicate failure
    }
  },

  /**
   * Clear all payment data from localStorage
   * @returns true if cleared successfully, false if failed
   */
  clearAllPayments: (): boolean => {          // Define function to clear all payments, returns boolean
    try {                                     // Start try block to handle potential errors
      const keysToRemove: string[] = [];      // Initialize array to store keys to remove
      for (let i = 0; i < localStorage.length; i++) {  // Loop through all keys in localStorage
        const key = localStorage.key(i);      // Get key at current index
        if (key && key.startsWith('payment_')) {  // Check if key exists and is a payment key
          keysToRemove.push(key);            // Add key to removal list
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));  // Remove each payment key from localStorage
      console.log(`Cleared ${keysToRemove.length} payments from localStorage`);  // Log number of payments cleared
      return true;                            // Return true to indicate successful clearing
    } catch (error) {                         // Catch any errors during clearing
      console.error('Failed to clear all payments:', error);  // Log error message with details
      return false;                           // Return false to indicate failure
    }
  }
};