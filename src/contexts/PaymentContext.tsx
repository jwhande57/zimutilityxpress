
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface PaymentState {
  selectedService: string | null;
  isLoading: boolean;
  error: string | null;
  paymentData: Record<string, any>;
}

type PaymentAction =
  | { type: 'SELECT_SERVICE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PAYMENT_DATA'; payload: Record<string, any> }
  | { type: 'RESET' };

const initialState: PaymentState = {
  selectedService: null,
  isLoading: false,
  error: null,
  paymentData: {},
};

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return { ...state, selectedService: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PAYMENT_DATA':
      return { ...state, paymentData: { ...state.paymentData, ...action.payload } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const PaymentContext = createContext<{
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
} | null>(null);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  return (
    <PaymentContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};
