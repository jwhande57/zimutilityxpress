
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'invalid_reference':
        return 'Invalid payment reference. The payment session may have expired.';
      case 'missing_reference':
        return 'Missing payment reference. Please start a new payment.';
      case 'session_expired':
        return 'Payment session has expired. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-orange-700">
              Error Code: <span className="font-mono font-medium">{error || 'UNKNOWN'}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
            >
              Start New Payment
            </Link>
            
            <Link
              to="/support"
              className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              Get Help
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            If this problem persists, please contact our support team with the error code above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
