
import { useState } from 'react';
import { rechargeApiService, RechargeRequest, RechargeResponse } from '../services/rechargeApi';

export const useRechargeProcessing = () => {
  const [isProcessingRecharge, setIsProcessingRecharge] = useState(false);

  /**
   * Processes a recharge after successful payment
   * Extracts phone number from customer data and triggers the recharge API
   */
  const processPostPaymentRecharge = async (
    paymentData: {
      service: string;
      amount: number;
      reference: string;
      customerData: Record<string, any>;
      timestamp: string;
    }
  ): Promise<RechargeResponse> => {
    setIsProcessingRecharge(true);
    
    try {
      // Extract phone number from customer data
      const phoneNumber = paymentData.customerData.phoneNumber || 
                         paymentData.customerData.mobileNumber || 
                         '263771234567'; // Fallback dummy number
      
      const rechargeRequest: RechargeRequest = {
        phoneNumber,
        amount: paymentData.amount,
        serviceType: paymentData.service,
        reference: paymentData.reference,
        timestamp: paymentData.timestamp
      };
      
      console.log('Initiating post-payment recharge:', rechargeRequest);
      
      const result = await rechargeApiService.processRecharge(rechargeRequest);
      
      if (result.success) {
        console.log('Recharge completed successfully:', result);
      } else {
        console.error('Recharge failed:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('Recharge processing error:', error);
      return {
        success: false,
        error: 'Failed to process recharge. Please contact support.'
      };
    } finally {
      setIsProcessingRecharge(false);
    }
  };

  return {
    processPostPaymentRecharge,
    isProcessingRecharge
  };
};
