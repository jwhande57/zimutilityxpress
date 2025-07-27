import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../contexts/PaymentContext';
import { validateEconetNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { ArrowLeft } from 'lucide-react';

// Mock API function to simulate backend response
// This will be replaced with the actual API call later
const mockApiCall = (phoneNumber: string, amount: number) => {
  return new Promise<{ txref: string; amountMicro: number; assetId: string; receiveAddr: string }>((resolve) => {
    setTimeout(() => {
      const txref = `tx_${Date.now()}`; // Unique transaction reference
      const amountMicro = Math.floor(amount * 1e6); // Convert amount to micro units (e.g., 0.2 USD -> 200000)
      const assetId = "USDC"; // Hardcoded asset ID
      const receiveAddr = "0x1234567890abcdef"; // Dummy receiving address
      resolve({ txref, amountMicro, assetId, receiveAddr });
    }, 1000); // Simulate network delay
  });
};

/** Econet Airtime Form Interface */
interface EconetAirtimeForm {
  phoneNumber: string;
}

const EconetAirtime: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();

  // Hard-coded amounts
  const predefinedAmounts = [0.2, 0.5, 1, 2, 5, 10, 20, 50];

  // Local selection state, default to the first amount
  const [selectedAmount, setSelectedAmount] = useState<number>(predefinedAmounts[0]);

  const { register, handleSubmit, formState: { errors } } = useForm<EconetAirtimeForm>();

  // Updated onSubmit function to include mock API call
  const onSubmit = async (data: EconetAirtimeForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Call the mock API with phone number and selected amount
      const response = await mockApiCall(data.phoneNumber, selectedAmount);
      
      // Navigate to /make-payment with the response data in state
      navigate('/make-payment', {
        state: {
          service: 'Econet Airtime',
          amount: selectedAmount,
          customerData: { phoneNumber: data.phoneNumber },
          paymentData: response // Include the API response
        }
      });
    } catch (error) {
      // Handle potential errors (mock API always succeeds, but included for future real API)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initiate payment' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    // Note: Loading state is not set to false here; assume /make-payment handles it
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center mb-6">
        <button
          onClick={() => dispatch({ type: 'SELECT_SERVICE', payload: null })}
          className="mr-4 mb-2 sm:mb-0 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ml-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Econet Airtime</h2>
          <p className="text-gray-600 text-sm">Top up your Econet line</p>
        </div>
      </div>

      {/* Error */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Phone Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: (v: string) =>
              validateEconetNumber(v) || 'Please enter a valid Econet number (077 or 078)',
          }}
        />

        {/* Amount Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`
                  p-2 sm:p-3 rounded-xl border-2 text-sm font-medium transition-colors
                  ${selectedAmount === amt
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'}
                `}
              >
                ${amt.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
        >
          {state.isLoading
            ? 'Redirecting…'
            : `Pay $${selectedAmount.toFixed(2)}`
          }
        </LoadingButton>
      </form>
    </div>
  );
};

export default EconetAirtime;