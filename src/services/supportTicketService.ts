
/**
 * Support Ticket Service Module
 * Handles submission and management of customer support tickets
 * Currently uses mock implementation - replace with real API calls when ready
 */

/**
 * Support Ticket Interface - Defines the structure of a support ticket
 * Contains all information needed to process customer support requests
 */
export interface SupportTicket {
  transactionReference: string;  // Payment reference for transaction-related issues
  serviceAccessed: string;       // Service type (e.g., "Econet Airtime")
  phoneNumber: string;           // Customer contact number
  email: string;                 // Customer email address
  issueType: string;             // Category of issue (e.g., "Payment Failed")
  details: string;               // Detailed description of the problem
}

/**
 * Support Ticket Response Interface - API response structure
 * Indicates success/failure and provides relevant information
 */
export interface SupportTicketResponse {
  success: boolean;      // Whether ticket submission was successful
  ticketId?: string;     // Unique identifier for the created ticket
  message: string;       // Human-readable response message
  error?: string;        // Error details if submission failed
}

/**
 * Support Ticket Service Object
 * Contains all functions related to support ticket management
 */
export const supportTicketService = {
  /**
   * Submit a new support ticket
   * @param ticket - Support ticket data to submit
   * @returns Promise resolving to submission response
   */
  submitTicket: async (ticket: SupportTicket): Promise<SupportTicketResponse> => {
    // Log ticket submission for debugging
    console.log('Submitting support ticket:', ticket);
    
    // Simulate network delay (500ms - 1500ms)
    const delay = 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 5% failure rate for testing error handling
    if (Math.random() < 0.05) {
      return {
        success: false,
        message: 'Failed to submit support ticket',
        error: 'Server temporarily unavailable'
      };
    }

    // Generate unique ticket ID using timestamp and random characters
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
    const ticketId = `TICKET${timestamp}${randomSuffix}`;

    // Return successful response
    return {
      success: true,
      ticketId,
      message: 'Support ticket submitted successfully. Our team will contact you within 24 hours.'
    };
  },

  /**
   * Get the status of an existing support ticket
   * @param ticketId - Unique ticket identifier
   * @returns Promise resolving to ticket status and update history
   */
  getTicketStatus: async (ticketId: string): Promise<{ status: string; updates: string[] }> => {
    // Log status check for debugging
    console.log('Checking ticket status:', ticketId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock status options
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Mock update history
    const updates = [
      'Ticket created and assigned to support team',
      'Investigation in progress',
      'Issue resolved and customer contacted'
    ];
    
    return {
      status: randomStatus,
      updates: updates
    };
  }
};
