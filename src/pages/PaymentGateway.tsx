
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePaymentProcessing } from '../hooks/usePaymentProcessing';
import LoadingButton from '../components/LoadingButton';

const PaymentGateway: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getPaymentData, completePayment } = usePaymentProcessing();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const reference = searchParams.get('ref');

  useEffect(() => {
    if (reference) {
      const data = getPaymentData(reference);
      if (data) {
        setPaymentData(data);
      } else {
        navigate('/payment/error?error=invalid_reference');
      }
    } else {
      navigate('/payment/error?error=missing_reference');
    }
  }, [reference, getPaymentData, navigate]);

  const handlePaymentSuccess = async () => {
    if (!reference) return;
    
    setIsProcessing(true);
    
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transactionId = `TXN${Date.now()}`;
    completePayment(reference, 'success', transactionId);
    
    navigate(`/payment/success?ref=${reference}&txn=${transactionId}`);
  };

  const handlePaymentFailure = async () => {
    if (!reference) return;
    
    setIsProcessing(true);
    
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    completePayment(reference, 'failed');
    
    navigate(`/payment/failed?ref=${reference}`);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">💳</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
            <p className="text-gray-600 text-sm mt-2">
              Reference: {reference}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{paymentData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">${paymentData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(paymentData.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <LoadingButton
              isLoading={isProcessing}
              onClick={handlePaymentSuccess}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
            >
              {isProcessing ? 'Processing...' : 'Simulate Successful Payment'}
            </LoadingButton>
            
            <LoadingButton
              isLoading={isProcessing}
              onClick={handlePaymentFailure}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
              type="button"
            >
              {isProcessing ? 'Processing...' : 'Simulate Failed Payment'}
            </LoadingButton>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            This is a demo payment gateway. In production, you would be redirected to your payment provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
