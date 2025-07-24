import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { ArrowLeft } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
// import { validatePolicyNumber, validateZimMobileNumber } from '../../utils/validators';
// import FormField from '../FormField';
// import LoadingButton from '../LoadingButton';

interface NyaradzoPolicyForm {
  policyNumber: string;
  amount: number;
  phoneNumber: string;
}

const NyaradzoPolicy: React.FC = () => {
  const { state, dispatch } = usePayment();
  // const { processPayment, isProcessing } = usePaymentProcessing();
  // const { register, handleSubmit, formState: { errors } } = useForm<NyaradzoPolicyForm>();

  // const onSubmit = async (data: NyaradzoPolicyForm) => {
  //   dispatch({ type: 'SET_LOADING', payload: true });
  //   try {
  //     const result = await processPayment({
  //       service: 'Nyaradzo Policy',
  //       amount: data.amount,
  //       customerData: {
  //         policyNumber: data.policyNumber,
  //         phoneNumber: data.phoneNumber,
  //         serviceType: 'insurance'
  //       }
  //     });
  //     if (result.success && result.redirectUrl) {
  //       window.location.href = result.redirectUrl;
  //     } else {
  //       dispatch({ type: 'SET_ERROR', payload: result.error || 'Payment processing failed' });
  //     }
  //   } catch {
  //     dispatch({ type: 'SET_ERROR', payload: 'Payment processing failed. Please try again.' });
  //   }
  // };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      {/* Header */}
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

      {/* Coming Soon Message */}
      <div className="py-20">
        <span className="text-2xl font-medium text-gray-700">This service is coming soon!</span>
      </div>

      {/* Back Button */}
      <button
        onClick={() => dispatch({ type: 'SELECT_SERVICE', payload: null })}
        className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
      >
        Go Back
      </button>

      {/*
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField ... />
        <FormField ... />
        <FormField ... />
        <LoadingButton ...>Make Payment</LoadingButton>
      </form>
      */}
    </div>
  );
};

export default NyaradzoPolicy;
