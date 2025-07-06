
import React from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { validateTelOneAccount, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';

interface TelOneBroadbandForm {
  accountNumber: string;
  bundle: string;
  phoneNumber: string;
}

const TelOneBroadband: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { register, handleSubmit, formState: { errors } } = useForm<TelOneBroadbandForm>();

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

  const onSubmit = async (data: TelOneBroadbandForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Processing TelOne payment:', data);
      dispatch({ type: 'SET_LOADING', payload: false });
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
          <span className="text-white font-bold">🌐</span>
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
          isLoading={state.isLoading}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
        >
          Make Payment
        </LoadingButton>
      </form>
    </div>
  );
};

export default TelOneBroadband;
