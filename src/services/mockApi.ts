
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaymentGatewayResponse {
  reference: string;
  redirectUrl: string;
  sessionId: string;
}

export interface PaymentConfirmationResponse {
  transactionId: string;
  status: 'success' | 'failed';
  reference: string;
  amount: number;
  timestamp: string;
}

export const mockApiService = {
  // Simulate payment gateway initialization
  initializePayment: async (paymentData: {
    service: string;
    amount: number;
    reference: string;
    customerData: Record<string, any>;
  }): Promise<ApiResponse<PaymentGatewayResponse>> => {
    console.log('Initializing payment with mock API:', paymentData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Payment gateway temporarily unavailable'
      };
    }

    const response: PaymentGatewayResponse = {
      reference: paymentData.reference,
      redirectUrl: `/payment/gateway?ref=${paymentData.reference}`,
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return {
      success: true,
      data: response,
      message: 'Payment session created successfully'
    };
  },

  // Simulate payment processing
  processPayment: async (reference: string, paymentMethod: string): Promise<ApiResponse<PaymentConfirmationResponse>> => {
    console.log('Processing payment with mock API:', { reference, paymentMethod });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Simulate success/failure (80% success rate)
    const isSuccess = Math.random() < 0.8;
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const response: PaymentConfirmationResponse = {
      transactionId: isSuccess ? transactionId : '',
      status: isSuccess ? 'success' : 'failed',
      reference,
      amount: 0, // This would come from the stored payment data
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      data: response,
      message: isSuccess ? 'Payment processed successfully' : 'Payment processing failed'
    };
  },

  // Simulate payment status check
  checkPaymentStatus: async (reference: string): Promise<ApiResponse<{ status: string; transactionId?: string }>> => {
    console.log('Checking payment status with mock API:', reference);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate various statuses
    const statuses = ['pending', 'success', 'failed', 'expired'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      success: true,
      data: {
        status: randomStatus,
        transactionId: randomStatus === 'success' ? `TXN${Date.now()}` : undefined
      }
    };
  },

  // Simulate service validation
  validateService: async (service: string, customerData: Record<string, any>): Promise<ApiResponse<{ valid: boolean; customerInfo?: any }>> => {
    console.log('Validating service with mock API:', { service, customerData });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate validation (90% success rate)
    const isValid = Math.random() < 0.9;
    
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid customer details or service unavailable'
      };
    }

    // Mock customer info based on service type
    let customerInfo = {};
    switch (service) {
      case 'ZESA Electricity':
        customerInfo = {
          customerName: 'John Doe',
          address: '123 Main Street, Harare',
          accountBalance: 15.50
        };
        break;
      case 'Econet Airtime':
      case 'NetOne Airtime':
        customerInfo = {
          customerName: 'Jane Smith',
          network: service.includes('Econet') ? 'Econet' : 'NetOne',
          currentBalance: 2.30
        };
        break;
      case 'Nyaradzo Policy':
        customerInfo = {
          policyHolder: 'Robert Johnson',
          policyType: 'Life Assurance',
          nextPremium: 45.00
        };
        break;
      default:
        customerInfo = { customerName: 'Unknown Customer' };
    }

    return {
      success: true,
      data: {
        valid: true,
        customerInfo
      }
    };
  }
};
