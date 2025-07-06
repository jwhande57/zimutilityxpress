
export interface SupportTicket {
  transactionReference: string;
  serviceAccessed: string;
  phoneNumber: string;
  email: string;
  issueType: string;
  details: string;
}

export interface SupportTicketResponse {
  success: boolean;
  ticketId?: string;
  message: string;
  error?: string;
}

export const supportTicketService = {
  // Submit support ticket
  submitTicket: async (ticket: SupportTicket): Promise<SupportTicketResponse> => {
    console.log('Submitting support ticket:', ticket);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate occasional failures (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        message: 'Failed to submit support ticket',
        error: 'Server temporarily unavailable'
      };
    }

    // Generate mock ticket ID
    const ticketId = `TICKET${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    return {
      success: true,
      ticketId,
      message: 'Support ticket submitted successfully. Our team will contact you within 24 hours.'
    };
  },

  // Get ticket status (for future use)
  getTicketStatus: async (ticketId: string): Promise<{ status: string; updates: string[] }> => {
    console.log('Checking ticket status:', ticketId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      updates: [
        'Ticket created and assigned to support team',
        'Investigation in progress',
        'Issue resolved and customer contacted'
      ]
    };
  }
};
