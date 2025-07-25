import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateNetOneNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../../utils/api';
import axios from 'axios';

interface NetOneAirtimeForm {
  phoneNumber: string;
}

const NetOneAirtime: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();

  // 🚨 Replacing useStockAmounts
  const [predefinedAmounts, setPredefinedAmounts] = useState<number[]>([]);
  const [amountsLoading, setAmountsLoading] = useState<boolean>(true);

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { register, handleSubmit, formState: { errors } } = useForm<NetOneAirtimeForm>();

  // ✅ Fetch stock amounts on mount
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/check-stock/35`);
        // axios puts actual payload on response.data
        const amounts = response.data.stock.map((item: any) => item.amount);
        setPredefinedAmounts(amounts);
      } catch (error: any) {
        console.error('Failed to fetch stock:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load stock amounts' });
      } finally {
        setAmountsLoading(false);
      }
    };

    fetchStock();
  }, [dispatch]);

  const onSubmit = async (data: NetOneAirtimeForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await processPayment({
        service: 'NetOne Airtime',
        amount: selectedAmount,
        customerData: {
          phoneNumber: data.phoneNumber,
          serviceType: 'airtime',
        },
      });

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Payment processing failed' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Payment processing failed. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => dispatch({ type: 'SELECT_SERVICE', payload: null })}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-gray-900">NetOne Airtime</h2>
          <p className="text-gray-600">Top up your NetOne line</p>
        </div>
      </div>

      {/* Error */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Phone Number"
          name="phoneNumber"
          placeholder="071 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: (value: string) =>
              validateNetOneNumber(value) || 'Please enter a valid NetOne number (071)',
          }}
        />

        {/* Amount Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>

          {amountsLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedAmount(amount)}
                  className={`
                    p-2 sm:p-3 rounded-xl border-2 text-sm font-medium transition-colors
                    ${selectedAmount === amount
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'}
                  `}
                >
                  ${amount.toFixed(2)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:shadow-lg"
          disabled={amountsLoading}
        >
          {state.isLoading || isProcessing
            ? 'Processing…'
            : `Pay $${selectedAmount.toFixed(2)}`
          }
        </LoadingButton>
      </form>
    </div>
  );
};

export default NetOneAirtime;
