// Import React’s useState hook for managing component state
import { useState } from 'react';
// Import helper to generate a unique payment reference
import { generatePaymentReference } from '../utils/paymentReference';
// Import manager for saving/retrieving payments in localStorage
import { localStorageManager } from '../utils/localStorage';
// Import a mock API service to simulate external payment initialization
import { mockApiService } from '../services/mockApi';

/**
 * Payment Data Interface - Core payment information structure
 * Used throughout the payment processing pipeline
 */
interface PaymentData {
  service: string;                      // Service name (e.g., "Econet Airtime")
  amount: number;                       // Payment amount in USD
  reference: string;                    // Unique payment reference
  customerData: Record<string, any>;    // Service-specific customer information
  timestamp: string;                    // ISO timestamp of payment initiation
}

/**
 * Process Payment Parameters Interface
 * Input structure for payment processing function
 */
interface ProcessPaymentParams {
  service: string;                      // Service being paid for
  amount: number;                       // Payment amount
  customerData: Record<string, any>;    // Customer/service specific data
}

/**
 * Payment Processing Result Interface
 * Output structure from payment processing function
 */
interface PaymentProcessingResult {
  success: boolean;                     // Whether payment processing succeeded
  reference?: string;                   // Payment reference if successful
  redirectUrl?: string;                 // URL to redirect to payment gateway
  error?: string;                       // Error message if processing failed
}

/**
 * Payment Processing Hook
 * Custom hook that handles the complete payment processing workflow:
 * 1. Generate unique payment reference
 * 2. Store payment data locally
 * 3. Initialize payment with external API
 * 4. Return redirect URL for payment gateway
 */
export const usePaymentProcessing = () => {
  // State flag indicating whether a payment operation is in progress
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Process Payment Function
   * Main function that orchestrates the entire payment flow
   *
   * @param params - Payment parameters (service, amount, customer data)
   * @returns Promise resolving to payment processing result
   */
  const processPayment = async (
    params: ProcessPaymentParams
  ): Promise<PaymentProcessingResult> => {
    // Begin loading state (e.g., show spinner)
    setIsProcessing(true);
    
    try {
      // Log the incoming parameters for debugging
      console.log('Starting payment processing:', params);
      
      // Generate a new, unique payment reference
      const reference = generatePaymentReference();
      
      // Build the payment data object to persist and send to API
      const paymentData: PaymentData = {
        service: params.service,
        amount: params.amount,
        reference,
        customerData: params.customerData,
        timestamp: new Date().toISOString(),
      };

      // Save the payment data locally with an initial status of 'pending'
      const saved = localStorageManager.savePayment({
        ...paymentData,
        status: 'pending'
      });

      // If saving to localStorage failed, abort and throw an error
      if (!saved) {
        throw new Error('Failed to save payment data');
      }

      // Call the external (mock) API to initialize the payment
      const apiResponse = await mockApiService.initializePayment(paymentData);
      
      // If API indicates failure or missing data, throw an error
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to initialize payment');
      }

      // Log the successful initialization details
      console.log('Payment initialization successful:', apiResponse.data);
      
      // Return a successful result including the redirect URL
      return {
        success: true,
        reference,
        redirectUrl: apiResponse.data.redirectUrl
      };
      
    } catch (error) {
      // Log any error that occurred during the process
      console.error('Payment processing error:', error);
      
      // Return a failure result with an appropriate message
      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : 'Failed to process payment. Please try again.'
      };
    } finally {
      // Reset the loading state after completion or error
      setIsProcessing(false);
    }
  };

  /**
   * Get Payment Data Function
   * Retrieves stored payment data by reference number
   *
   * @param reference - Payment reference to look up
   * @returns PaymentData if found, otherwise null
   */
  const getPaymentData = (reference: string): PaymentData | null => {
    // Fetch raw stored record (may include status, transactionId, etc.)
    const stored = localStorageManager.getPayment(reference);
    
    // If found, strip out extra fields and return as PaymentData
    return stored
      ? {
          service: stored.service,
          amount: stored.amount,
          reference: stored.reference,
          customerData: stored.customerData,
          timestamp: stored.timestamp
        }
      : null;  // Return null when not found
  };

  /**
   * Complete Payment Function
   * Updates payment status after gateway processing completes
   *
   * @param reference - Payment reference to update
   * @param status - Final payment status ('success' or 'failed')
   * @param transactionId - Optional transaction ID from payment processor
   */
  const completePayment = (
    reference: string,
    status: 'success' | 'failed',
    transactionId?: string
  ) => {
    // Attempt to update the status in localStorage
    const updated = localStorageManager.updatePaymentStatus(
      reference,
      status,
      transactionId
    );
    
    // Log depending on whether the update succeeded
    if (updated) {
      console.log('Payment status updated:', {
        reference,
        status,
        transactionId
      });
    } else {
      console.error('Failed to update payment status:', reference);
    }
  };

  /**
   * Cleanup Old Payments Function
   * Removes old payment records to manage storage space
   *
   * @returns Number of payments removed
   */
  const cleanupOldPayments = () => {
    return localStorageManager.cleanupOldPayments();
  };

  /**
   * Get Payment History Function
   * Retrieves all stored payment records
   *
   * @returns Array of all stored payments
   */
  const getPaymentHistory = () => {
    return localStorageManager.getAllPayments();
  };

  // Expose the hook’s API: functions & current processing flag
  return {
    processPayment,        // Initiates a payment
    getPaymentData,        // Fetches a single payment by reference
    completePayment,       // Marks a payment as completed/failed
    cleanupOldPayments,    // Deletes aged payment entries
    getPaymentHistory,     // Lists all stored payments
    isProcessing           // UI flag: true when processing
  };
};
