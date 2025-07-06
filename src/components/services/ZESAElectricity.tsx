
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateMeterNumber, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Zap } from 'lucide-react';

interface ZESAElectricityForm {
  meterNumber: string;
  phoneNumber: string;
}

const ZESAElectricity: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ZESAElectricityForm>();

  const quickAmounts = [5, 10, 20, 50, 100];

  const onSubmit = async (data: ZESAElectricityForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await processPayment({
        service: 'ZESA Electricity',
        amount: selectedAmount,
        customerData: {
          meterNumber: data.meterNumber,
          phoneNumber: data.phoneNumber,
          serviceType: 'electricity'
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
          ←
        </button>
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-gray-900">ZESA Electricity</h2>
          <p className="text-gray-600">Purchase electricity tokens</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Meter Number"
          name="meterNumber"
          placeholder="12345678901"
          register={register}
          error={errors.meterNumber}
          validation={{
            required: 'Meter number is required',
            validate: (value: string) => 
              validateMeterNumber(value) || 'Please enter a valid 11-digit meter number'
          }}
        />

        <FormField
          label="Notification Phone Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: (value: string) => 
              validateZimMobileNumber(value) || 'Please enter a valid Zimbabwean mobile number'
          }}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USD) - Minimum $5
          </label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  selectedAmount === amount
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Custom amount: $</span>
            <input
              type="number"
              min="5"
              max="1000"
              step="1"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(parseFloat(e.target.value) || 5)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg"
        >
          {state.isLoading || isProcessing ? 'Processing...' : `Pay $${selectedAmount.toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default ZESAElectricity;
