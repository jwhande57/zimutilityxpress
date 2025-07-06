
import { useState } from 'react';
import { generatePaymentReference } from '../utils/paymentReference';
import { localStorageManager } from '../utils/localStorage';
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
  success: boolean;          // Whether payment processing succeeded
  reference?: string;        // Payment reference if successful
  redirectUrl?: string;      // URL to redirect to payment gateway
  error?: string;           // Error message if processing failed
}

/**
 * Payment Processing Hook
 * Custom hook that handles the complete payment processing workflow:
 * 1. Generate unique payment reference
 * 2. Store payment data locally
 * 3. Initialize payment with external API
 * 4. Return redirect URL for payment gateway
 * 
 * @returns Object containing payment processing functions and state
 */
export const usePaymentProcessing = () => {
  // Loading state for async payment operations
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Process Payment Function
   * Main function that orchestrates the entire payment flow
   * 
   * @param params - Payment parameters (service, amount, customer data)
   * @returns Promise resolving to payment processing result
   */
  const processPayment = async (params: ProcessPaymentParams): Promise<PaymentProcessingResult> => {
    // Set loading state to true (triggers UI loading indicators)
    setIsProcessing(true);
    
    try {
      // Log payment initiation for debugging
      console.log('Starting payment processing:', params);
      
      // Step 1: Generate unique payment reference
      const reference = generatePaymentReference();
      
      // Step 2: Create comprehensive payment data object
      const paymentData: PaymentData = {
        service: params.service,
        amount: params.amount,
        reference,
        customerData: params.customerData,
        timestamp: new Date().toISOString(),
      };

      // Step 3: Save payment data to local storage for persistence
      const saved = localStorageManager.savePayment({
        ...paymentData,
        status: 'pending'  // Initial status before payment gateway
      });

      // Handle local storage failure
      if (!saved) {
        throw new Error('Failed to save payment data');
      }

      // Step 4: Initialize payment with external API service
      const apiResponse = await mockApiService.initializePayment(paymentData);
      
      // Handle API initialization failure
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to initialize payment');
      }

      // Log successful initialization
      console.log('Payment initialization successful:', apiResponse.data);
      
      // Return success result with redirect URL
      return {
        success: true,
        reference,
        redirectUrl: apiResponse.data.redirectUrl
      };
      
    } catch (error) {
      // Log error for debugging
      console.error('Payment processing error:', error);
      
      // Return error result with user-friendly message
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process payment. Please try again.'
      };
    } finally {
      // Always clear loading state when processing completes
      setIsProcessing(false);
    }
  };

  /**
   * Get Payment Data Function
   * Retrieves stored payment data by reference number
   * 
   * @param reference - Payment reference to look up
   * @returns Payment data if found, null if not found
   */
  const getPaymentData = (reference: string): PaymentData | null => {
    // Retrieve from local storage
    const stored = localStorageManager.getPayment(reference);
    
    // Transform stored data to PaymentData format (exclude status fields)
    return stored ? {
      service: stored.service,
      amount: stored.amount,
      reference: stored.reference,
      customerData: stored.customerData,
      timestamp: stored.timestamp
    } : null;
  };

  /**
   * Complete Payment Function
   * Updates payment status after gateway processing completes
   * 
   * @param reference - Payment reference to update
   * @param status - Final payment status ('success' or 'failed')
   * @param transactionId - Optional transaction ID from payment processor
   */
  const completePayment = (reference: string, status: 'success' | 'failed', transactionId?: string) => {
    // Update payment status in local storage
    const updated = localStorageManager.updatePaymentStatus(reference, status, transactionId);
    
    if (updated) {
      // Log successful update
      console.log('Payment status updated:', { reference, status, transactionId });
    } else {
      // Log update failure
      console.error('Failed to update payment status:', reference);
    }
  };

  /**
   * Cleanup Old Payments Function
   * Removes old payment records to manage storage space
   * 
   * @returns Number of payments cleaned up
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

  // Return all functions and state for use in components
  return {
    processPayment,        // Main payment processing function
    getPaymentData,        // Retrieve payment by reference
    completePayment,       // Update payment status
    cleanupOldPayments,    // Clean up old records
    getPaymentHistory,     // Get all payment records
    isProcessing          // Current processing state
  };
};
