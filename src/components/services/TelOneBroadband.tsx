
import React from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateTelOneAccount, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Wifi } from 'lucide-react';

interface TelOneBroadbandForm {
  accountNumber: string;
  bundle: string;
  phoneNumber: string;
}

const TelOneBroadband: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TelOneBroadbandForm>();

  const selectedBundle = watch('bundle');

  const bundles = [
    { id: 'bronze', name: 'Bronze 25 GB Day + 25 GB Night', price: 10.00 },
    { id: 'us75gb', name: 'US$B 75 GB', price: 20.00 },
    { id: 'silver', name: 'Silver 160 GB', price: 30.00 },
    { id: 'gold', name: 'Gold 300 GB', price: 50.00 },
    { id: 'diamond', name: 'Diamond 500 GB', price: 60.00 },
    { id: 'platinum', name: 'Platinum Unlimited* (FUP)', price: 90.00 },
    { id: 'unlimited1', name: 'US$B Unlimited 1', price: 140.00 },
    { id: 'unlimited2', name: 'US$B Unlimited 2', price: 200.00 },
    { id: 'voice4', name: 'Voice Bundle', price: 4.00 },
    { id: 'voice7', name: 'Voice Bundle', price: 7.00 },
    { id: 'voice13', name: 'Voice Bundle', price: 13.00 },
    { id: 'voice20', name: 'Voice Bundle', price: 20.00 },
    { id: 'voice25', name: 'Voice Bundle', price: 25.00 },
    { id: 'voicenet', name: 'Voice On‑Net', price: 5.00 },
  ];

  const getSelectedBundlePrice = () => {
    const bundle = bundles.find(b => b.id === selectedBundle);
    return bundle?.price || 0;
  };

  const onSubmit = async (data: TelOneBroadbandForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const bundlePrice = getSelectedBundlePrice();
      const selectedBundleInfo = bundles.find(b => b.id === data.bundle);
      
      const result = await processPayment({
        service: 'TelOne Broadband',
        amount: bundlePrice,
        customerData: {
          accountNumber: data.accountNumber,
          bundle: selectedBundleInfo?.name || data.bundle,
          phoneNumber: data.phoneNumber,
          serviceType: 'broadband'
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
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <Wifi className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-gray-900">TelOne Broadband</h2>
          <p className="text-gray-600">Purchase broadband packages</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Account Number"
          name="accountNumber"
          placeholder="123456"
          register={register}
          error={errors.accountNumber}
          validation={{
            required: 'Account number is required',
            validate: (value: string) => 
              validateTelOneAccount(value) || 'Please enter a valid TelOne account number'
          }}
        />

        <FormField
          label="Select Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: 'Please select a bundle' }}
        >
          <select
            {...register('bundle', { required: 'Please select a bundle' })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              errors.bundle ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Choose a bundle...</option>
            {bundles.map((bundle) => (
              <option key={bundle.id} value={bundle.id}>
                {bundle.name} - ${bundle.price.toFixed(2)}
              </option>
            ))}
          </select>
        </FormField>

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
          className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
        >
          {state.isLoading || isProcessing ? 'Processing...' : `Pay $${getSelectedBundlePrice().toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default TelOneBroadband;
