// "productId": 41

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateMeterNumber, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Zap, ArrowLeft } from 'lucide-react';

interface ZESAElectricityForm {
  meterNumber: string;
  phoneNumber: string;
}

const ZESAElectricity: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  
  // default $5, enforced by slider min
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
          serviceType: 'electricity',
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
          <h2 className="text-xl font-semibold text-gray-900">ZESA Electricity</h2>
          <p className="text-gray-600">Purchase electricity tokens</p>
        </div>
      </div>

      {/* Error */}
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
            validate: v => validateMeterNumber(v) || 'Please enter a valid 11-digit meter number',
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
            validate: v => validateZimMobileNumber(v) || 'Please enter a valid Zimbabwean mobile number',
          }}
        />

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USD) <span className="text-gray-500">(Min $5, Max $500)</span>
          </label>

          {/* Quick‑select buttons */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  selectedAmount === amt
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">${selectedAmount}</span>
            <input
              type="range"
              min={5}
              max={500}
              step={1}
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg bg-gray-200 accent-yellow-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600">$500</span>
          </div>
        </div>

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg"
        >
          {state.isLoading || isProcessing
            ? 'Processing...'
            : `Pay $${selectedAmount.toFixed(2)}`
          }
        </LoadingButton>
      </form>
    </div>
  );
};

export default ZESAElectricity;
