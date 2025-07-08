
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePaymentProcessing } from '../hooks/usePaymentProcessing';

const PaymentFailed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getPaymentData } = usePaymentProcessing();
  const [paymentData, setPaymentData] = useState<any>(null);

  const reference = searchParams.get('ref');

  useEffect(() => {
    if (reference) {
      const data = getPaymentData(reference);
      setPaymentData(data);
    }
  }, [reference, getPaymentData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            We were unable to process your payment. Please try again.
          </p>

          <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-900 mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700">Reference:</span>
                <span className="font-medium text-red-900">{reference}</span>
              </div>
              {paymentData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-red-700">Service:</span>
                    <span className="font-medium text-red-900">{paymentData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Amount:</span>
                    <span className="font-medium text-red-900">${paymentData.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Status:</span>
                    <span className="font-medium text-red-900">Failed</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">Common Issues:</h4>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Insufficient funds</li>
              <li>• Network connectivity issues</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
            >
              Try Again
            </Link>
            
            <Link
              to="/support"
              className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              Contact Support
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            No charges have been made to your account. Please check your payment details and try again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
