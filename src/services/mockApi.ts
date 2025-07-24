// Define a generic interface for API responses with an optional type parameter T defaulting to any
export interface ApiResponse<T = any> {
  // Boolean flag indicating whether the API call was successful
  success: boolean;
  // Optional field for data returned by the API, typed with T
  data?: T;
  // Optional field for an error message if the API call fails
  error?: string;
  // Optional field for a descriptive message about the API response
  message?: string;
}

// Define an interface for the response from payment gateway initialization
export interface PaymentGatewayResponse {
  // Unique reference string for the payment
  reference: string;
  // URL string to redirect the user to for completing the payment
  redirectUrl: string;
  // Unique session ID string for the payment session
  sessionId: string;
}

// Define an interface for the payment confirmation response
export interface PaymentConfirmationResponse {
  // Unique transaction ID string for the payment
  transactionId: string;
  // Status of the payment, restricted to 'success' or 'failed'
  status: 'success' | 'failed';
  // Reference string matching the payment initialization
  reference: string;
  // Numeric amount of the payment
  amount: number;
  // ISO string representing the timestamp of the payment confirmation
  timestamp: string;
}

// Export a mock API service object to simulate API interactions
export const mockApiService = {
  // Define an async function to simulate payment gateway initialization
  initializePayment: async (paymentData: {
    // String specifying the service being paid for
    service: string;
    // Numeric amount to be paid
    amount: number;
    // Unique reference string for the payment
    reference: string;
    // Object containing customer data as key-value pairs
    customerData: Record<string, any>;
  }): Promise<ApiResponse<PaymentGatewayResponse>> => {
    // Log the payment data to the console for debugging purposes
    console.log('Initializing payment with mock API:', paymentData);
    
    // Simulate an API delay between 1 and 2 seconds using a Promise and setTimeout
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate a 10% chance of random failure to mimic real-world issues
    if (Math.random() < 0.1) {
      // Return an object indicating failure with an error message
      return {
        // Set success flag to false to indicate failure
        success: false,
        // Provide an error message describing the failure
        error: 'Payment gateway temporarily unavailable'
      };
    }

    // Define a response object conforming to PaymentGatewayResponse interface
    const response: PaymentGatewayResponse = {
      // Use the reference provided in paymentData
      reference: paymentData.reference,
      // Construct a redirect URL using the payment reference
      redirectUrl: `/payment/gateway?ref=${paymentData.reference}`,
      // Generate a unique session ID using current timestamp and random string
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Return an object indicating success with the response data
    return {
      // Set success flag to true to indicate successful initialization
      success: true,
      // Include the response object as the data payload
      data: response,
      // Provide a success message
      message: 'Payment session created successfully'
    };
  },

  // Define an async function to simulate payment processing
  processPayment: async (reference: string, paymentMethod: string): Promise<ApiResponse<PaymentConfirmationResponse>> => {
    // Log the reference and payment method to the console for debugging
    console.log('Processing payment with mock API:', { reference, paymentMethod });
    
    // Simulate a processing delay between 2 and 4 seconds using a Promise and setTimeout
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Simulate an 80% success rate for payment processing
    const isSuccess = Math.random() < 0.8;
    // Generate a unique transaction ID using timestamp and random string
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Define a response object conforming to PaymentConfirmationResponse interface
    const response: PaymentConfirmationResponse = {
      // Assign transaction ID if successful, otherwise empty string
      transactionId: isSuccess ? transactionId : '',
      // Set status to 'success' or 'failed' based on isSuccess
      status: isSuccess ? 'success' : 'failed',
      // Use the provided reference string
      reference,
      // Set amount to 0 (placeholder; real value would come from stored data)
      amount: 0, // This would come from the stored payment data
      // Set timestamp to current time in ISO format
      timestamp: new Date().toISOString()
    };

    // Return an object with the processing result
    return {
      // Set success flag to true (API call succeeded, even if payment failed)
      success: true,
      // Include the response object as the data payload
      data: response,
      // Provide a message based on whether the payment succeeded or failed
      message: isSuccess ? 'Payment processed successfully' : 'Payment processing failed'
    };
  },

  // Define an async function to simulate checking payment status
  checkPaymentStatus: async (reference: string): Promise<ApiResponse<{ status: string; transactionId?: string }>> => {
    // Log the reference to the console for debugging
    console.log('Checking payment status with mock API:', reference);
    
    // Simulate a short delay of 0.5 seconds using a Promise and setTimeout
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Define an array of possible payment statuses
    const statuses = ['pending', 'success', 'failed', 'expired'];
    // Randomly select a status from the array
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Return an object with the status check result
    return {
      // Set success flag to true to indicate the API call succeeded
      success: true,
      // Include an object with status and optional transaction ID
      data: {
        // Set the randomly selected status
        status: randomStatus,
        // Include a transaction ID only if status is 'success'
        transactionId: randomStatus === 'success' ? `TXN${Date.now()}` : undefined
      }
    };
  },

  // Define an async function to simulate service validation
  validateService: async (service: string, customerData: Record<string, any>): Promise<ApiResponse<{ valid: boolean; customerInfo?: any }>> => {
    // Log the service and customer data to the console for debugging
    console.log('Validating service with mock API:', { service, customerData });
    
    // Simulate a delay of 0.8 seconds using a Promise and setTimeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate a 90% success rate for validation
    const isValid = Math.random() < 0.9;
    
    // Check if validation failed
    if (!isValid) {
      // Return an object indicating failure with an error message
      return {
        // Set success flag to false to indicate validation failure
        success: false,
        // Provide an error message for the failure
        error: 'Invalid customer details or service unavailable'
      };
    }

    // Declare a variable to hold mock customer information
    let customerInfo = {};
    // Use a switch statement to generate customer info based on service type
    switch (service) {
      // Handle case for 'ZESA Electricity' service
      case 'ZESA Electricity':
        // Assign mock customer info for ZESA Electricity
        customerInfo = {
          // Mock customer name
          customerName: 'John Doe',
          // Mock address
          address: '123 Main Street, Harare',
          // Mock account balance
          accountBalance: 15.50
        };
        // Exit the switch case
        break;
      // Handle cases for 'Econet Airtime' or 'NetOne Airtime' services
      case 'Econet Airtime':
      case 'NetOne Airtime':
        // Assign mock customer info for airtime services
        customerInfo = {
          // Mock customer name
          customerName: 'Jane Smith',
          // Determine network based on service string
          network: service.includes('Econet') ? 'Econet' : 'NetOne',
          // Mock current balance
          currentBalance: 2.30
        };
        // Exit the switch case
        break;
      // Handle case for 'Nyaradzo Policy' service
      case 'Nyaradzo Policy':
        // Assign mock customer info for Nyaradzo Policy
        customerInfo = {
          // Mock policy holder name
          policyHolder: 'Robert Johnson',
          // Mock policy type
          policyType: 'Life Assurance',
          // Mock next premium amount
          nextPremium: 45.00
        };
        // Exit the switch case
        break;
      // Handle any unrecognized service as default case
      default:
        // Assign minimal mock customer info for unknown service
        customerInfo = { customerName: 'Unknown Customer' };
    }

    // Return an object indicating successful validation
    return {
      // Set success flag to true to indicate the API call succeeded
      success: true,
      // Include an object with validation result and customer info
      data: {
        // Set valid flag to true to indicate successful validation
        valid: true,
        // Include the generated customer info
        customerInfo
      }
    };
  }
};