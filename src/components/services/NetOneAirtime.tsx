
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateNetOneNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import {ArrowLeft} from 'lucide-react';

interface NetOneAirtimeForm {
  phoneNumber: string;
}

const NetOneAirtime: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  
  const { register, handleSubmit, formState: { errors } } = useForm<NetOneAirtimeForm>();

  const predefinedAmounts = [0.50, 1, 2, 5, 10, 20, 50];

  const onSubmit = async (data: NetOneAirtimeForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await processPayment({
        service: 'NetOne Airtime',
        amount: selectedAmount,
        customerData: {
          phoneNumber: data.phoneNumber,
          serviceType: 'airtime'
        }
      });

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Payment processing failed' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Payment processing failed. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
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

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {state.error}
        </div>
      )}

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
              validateNetOneNumber(value) || 'Please enter a valid NetOne number (071)'
          }}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  selectedAmount === amount
                    ? 'from-orange-400 to-orange-500 text-orange-500'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:shadow-lg"
        >
          {state.isLoading || isProcessing ? 'Processing...' : `Pay $${selectedAmount.toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default NetOneAirtime;
