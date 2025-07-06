
import React from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validatePolicyNumber, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Shield } from 'lucide-react';

interface NyaradzoPolicyForm {
  policyNumber: string;
  amount: number;
  phoneNumber: string;
}

const NyaradzoPolicy: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const { register, handleSubmit, formState: { errors } } = useForm<NyaradzoPolicyForm>();

  const onSubmit = async (data: NyaradzoPolicyForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await processPayment({
        service: 'Nyaradzo Policy',
        amount: data.amount,
        customerData: {
          policyNumber: data.policyNumber,
          phoneNumber: data.phoneNumber,
          serviceType: 'insurance'
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
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
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
              validatePolicyNumber(value) || 'Please enter a valid policy number (e.g., NY12345678)'
          }}
        />

        <FormField
          label="Payment Amount (USD)"
          name="amount"
          type="number"
          placeholder="50.00"
          register={register}
          error={errors.amount}
          validation={{
            required: 'Payment amount is required',
            min: { value: 1, message: 'Minimum payment is $1' },
            max: { value: 10000, message: 'Maximum payment is $10,000' }
          }}
        />

        <FormField
          label="Notification Mobile Number"
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

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:shadow-lg"
        >
          {state.isLoading || isProcessing ? 'Processing...' : 'Make Payment'}
        </LoadingButton>
      </form>
    </div>
  );
};

export default NyaradzoPolicy;
