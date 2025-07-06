
import { useState } from 'react';
import { generatePaymentReference } from '../utils/paymentReference';

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

      // Store payment data in localStorage (in real app, this would be sent to backend)
      localStorage.setItem(`payment_${reference}`, JSON.stringify(paymentData));
      
      console.log('Payment data stored:', paymentData);

      // Simulate payment gateway redirect URL generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call your backend API
      // which would then redirect to the actual payment gateway
      const redirectUrl = `/payment/gateway?ref=${reference}`;
      
      return {
        success: true,
        reference,
        redirectUrl
      };
      
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Failed to process payment. Please try again.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentData = (reference: string): PaymentData | null => {
    try {
      const stored = localStorage.getItem(`payment_${reference}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const completePayment = (reference: string, status: 'success' | 'failed', transactionId?: string) => {
    try {
      const paymentData = getPaymentData(reference);
      if (paymentData) {
        const completedPayment = {
          ...paymentData,
          status,
          transactionId,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem(`payment_${reference}`, JSON.stringify(completedPayment));
        console.log('Payment completed:', completedPayment);
      }
    } catch (error) {
      console.error('Error completing payment:', error);
    }
  };

  return {
    processPayment,
    getPaymentData,
    completePayment,
    isProcessing
  };
};
