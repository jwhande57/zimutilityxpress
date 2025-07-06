
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
  reference: string;                    // Unique payment reference
  service: string;                      // Service name (e.g., "Econet Airtime")
  amount: number;                       // Payment amount in USD
  customerData: Record<string, any>;    // Service-specific customer data
  timestamp: string;                    // ISO string of payment creation
  status?: 'pending' | 'success' | 'failed';  // Payment processing status
  transactionId?: string;               // External transaction identifier
  completedAt?: string;                 // ISO string of completion time
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
  savePayment: (payment: StoredPayment): boolean => {
    try {
      // Create unique key using payment reference
      const key = `payment_${payment.reference}`;
      
      // Serialize payment object to JSON string
      const serializedData = JSON.stringify(payment);
      
      // Store in localStorage
      localStorage.setItem(key, serializedData);
      
      // Log successful storage for debugging
      console.log('Payment saved to localStorage:', payment);
      return true;
    } catch (error) {
      // Handle storage errors (quota exceeded, privacy mode, etc.)
      console.error('Failed to save payment to localStorage:', error);
      return false;
    }
  },

  /**
   * Retrieve payment data from localStorage
   * @param reference - Payment reference to look up
   * @returns Payment data if found, null if not found or error
   */
  getPayment: (reference: string): StoredPayment | null => {
    try {
      // Construct storage key
      const key = `payment_${reference}`;
      
      // Retrieve serialized data
      const stored = localStorage.getItem(key);
      
      // Return null if no data found
      if (!stored) return null;
      
      // Parse JSON data back to object
      const payment = JSON.parse(stored);
      
      // Log successful retrieval for debugging
      console.log('Payment retrieved from localStorage:', payment);
      return payment;
    } catch (error) {
      // Handle parsing errors or storage access issues
      console.error('Failed to retrieve payment from localStorage:', error);
      return null;
    }
  },

  /**
   * Update payment status (success/failed) and add transaction ID
   * @param reference - Payment reference to update
   * @param status - New status ('success' or 'failed')
   * @param transactionId - Optional transaction ID from payment processor
   * @returns true if updated successfully, false if failed
   */
  updatePaymentStatus: (reference: string, status: 'success' | 'failed', transactionId?: string): boolean => {
    try {
      // Get existing payment data
      const payment = localStorageManager.getPayment(reference);
      
      // Return false if payment not found
      if (!payment) return false;

      // Create updated payment object
      const updatedPayment = {
        ...payment,
        status,
        transactionId,
        completedAt: new Date().toISOString()  // Record completion timestamp
      };

      // Save updated payment data
      return localStorageManager.savePayment(updatedPayment);
    } catch (error) {
      // Handle update errors
      console.error('Failed to update payment status:', error);
      return false;
    }
  },

  /**
   * Get all stored payments sorted by creation time (newest first)
   * @returns Array of all stored payments
   */
  getAllPayments: (): StoredPayment[] => {
    try {
      const payments: StoredPayment[] = [];
      
      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Only process payment-related keys
        if (key && key.startsWith('payment_')) {
          // Extract reference from key and retrieve payment
          const reference = key.replace('payment_', '');
          const payment = localStorageManager.getPayment(reference);
          
          // Add to array if successfully retrieved
          if (payment) payments.push(payment);
        }
      }
      
      // Sort by timestamp (newest first)
      return payments.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      // Handle retrieval errors
      console.error('Failed to get all payments:', error);
      return [];
    }
  },

  /**
   * Clean up old payments (older than 30 days) to manage storage space
   * @returns Number of payments cleaned up
   */
  cleanupOldPayments: (): number => {
    try {
      // Calculate cutoff date (30 days ago)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let cleanedCount = 0;
      const keysToRemove: string[] = [];

      // Find old payment keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith('payment_')) {
          const reference = key.replace('payment_', '');
          const payment = localStorageManager.getPayment(reference);
          
          // Mark for removal if older than 30 days
          if (payment && new Date(payment.timestamp) < thirtyDaysAgo) {
            keysToRemove.push(key);
          }
        }
      }

      // Remove old payment records
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        cleanedCount++;
      });

      // Log cleanup results
      console.log(`Cleaned up ${cleanedCount} old payments`);
      return cleanedCount;
    } catch (error) {
      // Handle cleanup errors
      console.error('Failed to cleanup old payments:', error);
      return 0;
    }
  },

  /**
   * Clear all payment data from localStorage
   * @returns true if cleared successfully, false if failed
   */
  clearAllPayments: (): boolean => {
    try {
      const keysToRemove: string[] = [];
      
      // Collect all payment-related keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('payment_')) {
          keysToRemove.push(key);
        }
      }

      // Remove all payment keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Log clearing results
      console.log(`Cleared ${keysToRemove.length} payments from localStorage`);
      return true;
    } catch (error) {
      // Handle clearing errors
      console.error('Failed to clear all payments:', error);
      return false;
    }
  }
};
