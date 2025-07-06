
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/**
 * PaymentState Interface - Defines the shape of payment-related state
 * This manages the current state of payment flows throughout the application
 */
interface PaymentState {
  selectedService: string | null;  // Currently selected service (e.g., 'econet-airtime')
  isLoading: boolean;              // Loading state for async operations
  error: string | null;            // Error message to display to user
  paymentData: Record<string, any>; // Flexible storage for payment-specific data
}

/**
 * PaymentAction Type - Defines all possible actions that can modify payment state
 * Uses discriminated union pattern for type safety
 */
type PaymentAction =
  | { type: 'SELECT_SERVICE'; payload: string }           // User selects a service
  | { type: 'SET_LOADING'; payload: boolean }             // Toggle loading state
  | { type: 'SET_ERROR'; payload: string | null }         // Set/clear error messages
  | { type: 'SET_PAYMENT_DATA'; payload: Record<string, any> } // Store payment form data
  | { type: 'RESET' };                                    // Reset to initial state

/**
 * Initial state configuration - Default values when app starts
 */
const initialState: PaymentState = {
  selectedService: null,    // No service selected initially
  isLoading: false,         // Not loading by default
  error: null,              // No errors initially
  paymentData: {},          // Empty payment data object
};

/**
 * Payment Reducer - Pure function that handles state transitions
 * Takes current state and action, returns new state
 * @param state - Current payment state
 * @param action - Action to perform
 * @returns New payment state
 */
const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SELECT_SERVICE':
      // User selects a service - clear any previous errors
      return { 
        ...state, 
        selectedService: action.payload, 
        error: null 
      };
      
    case 'SET_LOADING':
      // Toggle loading state for async operations
      return { 
        ...state, 
        isLoading: action.payload 
      };
      
    case 'SET_ERROR':
      // Set error message and stop loading
      return { 
        ...state, 
        error: action.payload, 
        isLoading: false 
      };
      
    case 'SET_PAYMENT_DATA':
      // Merge new payment data with existing data
      return { 
        ...state, 
        paymentData: { ...state.paymentData, ...action.payload } 
      };
      
    case 'RESET':
      // Reset to initial state (useful after successful payment)
      return initialState;
      
    default:
      // Return current state if action type is not recognized
      return state;
  }
};

/**
 * PaymentContext - React context for sharing payment state across components
 * Provides both state and dispatch function to child components
 */
const PaymentContext = createContext<{
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
} | null>(null);

/**
 * PaymentProvider Component - Wraps app sections that need payment state
 * Uses useReducer hook to manage complex state logic
 * @param children - Child components that will have access to payment context
 */
export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  // Initialize payment state using reducer pattern
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  return (
    // Provide state and dispatch to all child components
    <PaymentContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
};

/**
 * usePayment Hook - Custom hook for consuming payment context
 * Provides type-safe access to payment state and actions
 * @returns Payment state and dispatch function
 * @throws Error if used outside of PaymentProvider
 */
export const usePayment = () => {
  // Get context value
  const context = useContext(PaymentContext);
  
  // Ensure hook is used within provider
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  
  return context;
};
