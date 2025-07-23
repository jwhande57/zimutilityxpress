
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePaymentProcessing } from '../hooks/usePaymentProcessing';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getPaymentData } = usePaymentProcessing();
  const [paymentData, setPaymentData] = useState<any>(null);

  const reference = searchParams.get('ref');
  const transactionId = searchParams.get('txn');

  useEffect(() => {
    if (reference) {
      const data = getPaymentData(reference);
      setPaymentData(data);
    }
  }, [reference, getPaymentData]);

  const isAirtimeService = paymentData && ['Econet Airtime', 'NetOne Airtime', 'Econet Data'].includes(paymentData.service);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
            {isAirtimeService && ' Your account has been recharged.'}
          </p>

          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-900 mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Reference:</span>
                <span className="font-medium text-green-900">{reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Transaction ID:</span>
                <span className="font-medium text-green-900">{transactionId}</span>
              </div>
              {paymentData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-green-700">Service:</span>
                    <span className="font-medium text-green-900">{paymentData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Amount:</span>
                    <span className="font-medium text-green-900">${paymentData.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Date:</span>
                    <span className="font-medium text-green-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Show recharge confirmation for airtime services */}
          {isAirtimeService && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Recharge Status</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-700">Account recharged successfully</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
            >
              Make Another Payment
            </Link>
            
            <button
              onClick={() => window.print()}
              className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-colors"
            >
              Print Receipt
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Keep this reference number for your records. You will receive a confirmation SMS shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
