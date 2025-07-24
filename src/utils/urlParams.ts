// Define an interface for payment URL parameters
export interface PaymentUrlParams {
  ref?: string; // Optional reference parameter
  txn?: string; // Optional transaction ID parameter
  error?: string; // Optional error message parameter
  status?: 'success' | 'failed' | 'error'; // Optional status parameter with specific allowed values
  amount?: string; // Optional amount parameter
  service?: string; // Optional service parameter
}

// Create an object to manage URL parameters related to payments
export const urlParamsManager = {
  // Method to extract payment parameters from URL search parameters
  getPaymentParams: (searchParams: URLSearchParams): PaymentUrlParams => {
    const params: PaymentUrlParams = {}; // Initialize an empty object to hold the extracted parameters
    
    const ref = searchParams.get('ref'); // Get the 'ref' parameter from the URL search params
    const txn = searchParams.get('txn'); // Get the 'txn' parameter from the URL search params
    const error = searchParams.get('error'); // Get the 'error' parameter from the URL search params
    const status = searchParams.get('status'); // Get the 'status' parameter from the URL search params
    const amount = searchParams.get('amount'); // Get the 'amount' parameter from the URL search params
    const service = searchParams.get('service'); // Get the 'service' parameter from the URL search params

    if (ref) params.ref = ref; // Set ref in the params object if it exists
    if (txn) params.txn = txn; // Set txn in the params object if it exists
    if (error) params.error = error; // Set error in the params object if it exists
    if (status && ['success', 'failed', 'error'].includes(status)) { // Check if status exists and is valid
      params.status = status as 'success' | 'failed' | 'error'; // Set status in the params object with type assertion
    }
    if (amount) params.amount = amount; // Set amount in the params object if it exists
    if (service) params.service = service; // Set service in the params object if it exists

    console.log('Extracted URL params:', params); // Log the extracted parameters for debugging
    return params; // Return the object containing the extracted parameters
  },

  // Method to build a payment redirect URL with the given base URL and parameters
  buildPaymentUrl: (baseUrl: string, params: PaymentUrlParams): string => {
    const url = new URL(baseUrl, window.location.origin); // Create a new URL object with the base URL and current origin
    
    Object.entries(params).forEach(([key, value]) => { // Iterate over each key-value pair in the params object
      if (value !== undefined && value !== null) { // Check if the value is defined and not null
        url.searchParams.set(key, value.toString()); // Add the parameter to the URL's search params
      }
    });

    const finalUrl = url.toString(); // Convert the URL object to a string
    console.log('Built payment URL:', finalUrl); // Log the constructed URL for debugging
    return finalUrl; // Return the fully constructed URL as a string
  },

  // Method to validate if all required parameters are present
  validateParams: (params: PaymentUrlParams, required: (keyof PaymentUrlParams)[]): boolean => {
    const missing = required.filter(key => !params[key]); // Filter required keys to find any missing in params
    if (missing.length > 0) { // Check if there are any missing required parameters
      console.error('Missing required URL parameters:', missing); // Log an error with the missing parameters
      return false; // Return false if any required parameters are missing
    }
    return true; // Return true if all required parameters are present
  },

  // Method to clean the URL by removing payment-specific parameters
  cleanUrl: (): void => {
    const url = new URL(window.location.href); // Get the current URL as a URL object
    const paramsToRemove = ['ref', 'txn', 'error', 'status', 'amount', 'service']; // Define the list of parameters to remove
    
    paramsToRemove.forEach(param => url.searchParams.delete(param)); // Remove each specified parameter from the URL
    
    window.history.replaceState({}, document.title, url.pathname); // Update the browser URL without reloading, keeping only the pathname
    console.log('Cleaned URL parameters'); // Log the cleaning action for debugging
  }
};