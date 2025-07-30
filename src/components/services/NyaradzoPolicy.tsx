import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../contexts/PaymentContext';
import { validatePolicyNumber, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';

interface NyaradzoPolicyForm {
  policyNumber: string;
  amount: number;
  phoneNumber: string;
}

const NYARADZO_PRODUCT_ID = 60; // Replace with actual product ID
const NYARADZO_PRODUCT_CODE = 'NYARADZO'; // Replace with actual product code

const NyaradzoPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NyaradzoPolicyForm>();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);

  // Sync selectedAmount with form state for validation
  useEffect(() => {
    setValue('amount', selectedAmount, { shouldValidate: true });
  }, [selectedAmount, setValue]);

  const quickAmounts = [50, 100, 200, 500, 1000];

  const onSubmit = async (data: NyaradzoPolicyForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const requestBody = {
        usd_amount: data.amount,
        productId: NYARADZO_PRODUCT_ID,
        productCode: NYARADZO_PRODUCT_CODE,
        target: data.policyNumber,
      };
      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      navigate('/make-payment', {
        state: {
          service: 'Nyaradzo Policy',
          usd_amount: response.data.usd_amount,
          customerData: {
            policyNumber: response.data.target,
            phoneNumber: data.phoneNumber,
          },
          txref: response.data.txref,
          payment_link: response.data.payment_link,
        },
      });
    } catch (error) {
      let errorMessage = 'Failed to initialize payment, please try again';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
          <h2 className="text-xl font-semibold text-gray-900">Nyaradzo Policy</h2>
          <p className="text-gray-600">Pay your life assurance policy</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Policy Number"
          name="policyNumber"
          placeholder="NY12345678"
          register={register}
          error={errors.policyNumber}
          validation={{
            required: 'Policy number is required',
            validate: (value: string) =>
              validatePolicyNumber(value) || 'Please enter a valid policy number (e.g., NY12345678)',
          }}
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount (USD) <span className="text-gray-500">(Min $1, Max $10,000)</span>
          </label>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  selectedAmount === amt
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">${selectedAmount}</span>
            <input
              type="range"
              min={1}
              max={10000}
              step={1}
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg bg-gray-200 accent-indigo-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600">$10,000</span>
          </div>

          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <FormField
          label="Notification Mobile Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: (value: string) =>
              validateZimMobileNumber(value) || 'Please enter a valid Zimbabwean mobile number',
          }}
        />

        <LoadingButton
          isLoading={state.isLoading}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:shadow-lg"
        >
          {state.isLoading ? 'Processing...' : `Pay $${selectedAmount.toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default NyaradzoPolicy;