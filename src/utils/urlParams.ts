
export interface PaymentUrlParams {
  ref?: string;
  txn?: string;
  error?: string;
  status?: 'success' | 'failed' | 'error';
  amount?: string;
  service?: string;
}

export const urlParamsManager = {
  // Extract payment parameters from URL
  getPaymentParams: (searchParams: URLSearchParams): PaymentUrlParams => {
    const params: PaymentUrlParams = {};
    
    const ref = searchParams.get('ref');
    const txn = searchParams.get('txn');
    const error = searchParams.get('error');
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const service = searchParams.get('service');

    if (ref) params.ref = ref;
    if (txn) params.txn = txn;
    if (error) params.error = error;
    if (status && ['success', 'failed', 'error'].includes(status)) {
      params.status = status as 'success' | 'failed' | 'error';
    }
    if (amount) params.amount = amount;
    if (service) params.service = service;

    console.log('Extracted URL params:', params);
    return params;
  },

  // Build payment redirect URL
  buildPaymentUrl: (baseUrl: string, params: PaymentUrlParams): string => {
    const url = new URL(baseUrl, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value.toString());
      }
    });

    const finalUrl = url.toString();
    console.log('Built payment URL:', finalUrl);
    return finalUrl;
  },

  // Validate required parameters
  validateParams: (params: PaymentUrlParams, required: (keyof PaymentUrlParams)[]): boolean => {
    const missing = required.filter(key => !params[key]);
    if (missing.length > 0) {
      console.error('Missing required URL parameters:', missing);
      return false;
    }
    return true;
  },

  // Clean URL parameters (remove payment-specific params)
  cleanUrl: (): void => {
    const url = new URL(window.location.href);
    const paramsToRemove = ['ref', 'txn', 'error', 'status', 'amount', 'service'];
    
    paramsToRemove.forEach(param => url.searchParams.delete(param));
    
    window.history.replaceState({}, document.title, url.pathname);
    console.log('Cleaned URL parameters');
  }
};
