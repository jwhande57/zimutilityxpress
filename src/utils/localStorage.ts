
interface StoredPayment {
  reference: string;
  service: string;
  amount: number;
  customerData: Record<string, any>;
  timestamp: string;
  status?: 'pending' | 'success' | 'failed';
  transactionId?: string;
  completedAt?: string;
}

export const localStorageManager = {
  // Payment data management
  savePayment: (payment: StoredPayment): boolean => {
    try {
      const key = `payment_${payment.reference}`;
      localStorage.setItem(key, JSON.stringify(payment));
      console.log('Payment saved to localStorage:', payment);
      return true;
    } catch (error) {
      console.error('Failed to save payment to localStorage:', error);
      return false;
    }
  },

  getPayment: (reference: string): StoredPayment | null => {
    try {
      const key = `payment_${reference}`;
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const payment = JSON.parse(stored);
      console.log('Payment retrieved from localStorage:', payment);
      return payment;
    } catch (error) {
      console.error('Failed to retrieve payment from localStorage:', error);
      return null;
    }
  },

  updatePaymentStatus: (reference: string, status: 'success' | 'failed', transactionId?: string): boolean => {
    try {
      const payment = localStorageManager.getPayment(reference);
      if (!payment) return false;

      const updatedPayment = {
        ...payment,
        status,
        transactionId,
        completedAt: new Date().toISOString()
      };

      return localStorageManager.savePayment(updatedPayment);
    } catch (error) {
      console.error('Failed to update payment status:', error);
      return false;
    }
  },

  // Get all payments
  getAllPayments: (): StoredPayment[] => {
    try {
      const payments: StoredPayment[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('payment_')) {
          const payment = localStorageManager.getPayment(key.replace('payment_', ''));
          if (payment) payments.push(payment);
        }
      }
      return payments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Failed to get all payments:', error);
      return [];
    }
  },

  // Clean up old payments (older than 30 days)
  cleanupOldPayments: (): number => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let cleanedCount = 0;
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('payment_')) {
          const payment = localStorageManager.getPayment(key.replace('payment_', ''));
          if (payment && new Date(payment.timestamp) < thirtyDaysAgo) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        cleanedCount++;
      });

      console.log(`Cleaned up ${cleanedCount} old payments`);
      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup old payments:', error);
      return 0;
    }
  },

  // Clear all payment data
  clearAllPayments: (): boolean => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('payment_')) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keysToRemove.length} payments from localStorage`);
      return true;
    } catch (error) {
      console.error('Failed to clear all payments:', error);
      return false;
    }
  }
};
