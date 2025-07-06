
import { useState } from 'react';
import { generatePaymentReference } from '../utils/paymentReference';
import { localStorageManager } from '../utils/localStorage';
import { mockApiService } from '../services/mockApi';

interface PaymentData {
  service: string;
  amount: number;
  reference: string;
  customerData: Record<string, any>;
  timestamp: string;
}

interface ProcessPaymentParams {
  service: string;
  amount: number;
  customerData: Record<string, any>;
}

interface PaymentProcessingResult {
  success: boolean;
  reference?: string;
  redirectUrl?: string;
  error?: string;
}

export const usePaymentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (params: ProcessPaymentParams): Promise<PaymentProcessingResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Starting payment processing:', params);
      
      // Generate unique payment reference
      const reference = generatePaymentReference();
      
      // Create payment data object
      const paymentData: PaymentData = {
        service: params.service,
        amount: params.amount,
        reference,
        customerData: params.customerData,
        timestamp: new Date().toISOString(),
      };

      // Save payment data using localStorage manager
      const saved = localStorageManager.savePayment({
        ...paymentData,
        status: 'pending'
      });

      if (!saved) {
        throw new Error('Failed to save payment data');
      }

      // Initialize payment with mock API
      const apiResponse = await mockApiService.initializePayment(paymentData);
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to initialize payment');
      }

      console.log('Payment initialization successful:', apiResponse.data);
      
      return {
        success: true,
        reference,
        redirectUrl: apiResponse.data.redirectUrl
      };
      
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process payment. Please try again.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentData = (reference: string): PaymentData | null => {
    const stored = localStorageManager.getPayment(reference);
    return stored ? {
      service: stored.service,
      amount: stored.amount,
      reference: stored.reference,
      customerData: stored.customerData,
      timestamp: stored.timestamp
    } : null;
  };

  const completePayment = (reference: string, status: 'success' | 'failed', transactionId?: string) => {
    const updated = localStorageManager.updatePaymentStatus(reference, status, transactionId);
    if (updated) {
      console.log('Payment status updated:', { reference, status, transactionId });
    } else {
      console.error('Failed to update payment status:', reference);
    }
  };

  // Cleanup old payments periodically
  const cleanupOldPayments = () => {
    return localStorageManager.cleanupOldPayments();
  };

  // Get payment history
  const getPaymentHistory = () => {
    return localStorageManager.getAllPayments();
  };

  return {
    processPayment,
    getPaymentData,
    completePayment,
    cleanupOldPayments,
    getPaymentHistory,
    isProcessing
  };
};
