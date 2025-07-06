
import React from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateEconetNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Smartphone } from 'lucide-react';

interface EconetDataForm {
  phoneNumber: string;
  bundle: string;
}

const EconetData: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<EconetDataForm>();

  const selectedBundle = watch('bundle');

  const dataBundles = [
    { id: '1hour', name: '1 Hour bundle – Peak 960 MB / Off‑peak 240 MB', price: 1.00 },
    { id: '2hour', name: '2 Hour bundle – Peak 2500 MB / Off‑peak 500 MB', price: 2.00 },
    { id: 'voice30', name: 'Bundle of Joy Voice 30 min / 7 days', price: 0.50 },
    { id: 'voice50', name: 'Bundle of Joy Voice 50 min / 7 days', price: 1.00 },
    { id: 'voice250', name: 'Bundle of Joy Voice 250 min / 7 days', price: 3.50 },
    { id: 'voice500', name: 'Bundle of Joy Voice 500 min / 7 days', price: 6.50 },
    { id: 'voice700', name: 'Bundle of Joy Voice 700 min / 20 days', price: 9.00 },
    { id: 'voice1000', name: 'Bundle of Joy Voice 1000 min / 30 days', price: 13.00 },
    { id: 'data120', name: 'Data 120 MB + 15 SMS', price: 0.75 },
    { id: 'daily240', name: 'Daily Data 240/60 MB', price: 1.50 },
    { id: 'daily520', name: 'Daily Data 520/130 MB', price: 3.00 },
    { id: 'data300', name: 'Data 300 MB + 8 SMS', price: 0.30 },
    { id: '2hour3gb', name: '2 Hour Data 3000 MB + Voice 2 min', price: 2.00 },
    { id: 'data400voice', name: 'Data 400 MB + 15 min Voice', price: 2.00 },
    { id: 'data650', name: 'Data 650 MB + 4 min / 1 day', price: 3.00 },
    { id: 'monthly5gb', name: 'Monthly 5 GB + Voice 20 min / 30 days', price: 9.00 },
    { id: 'wifi10gb', name: 'Private Wi‑Fi 10 GB + Voice 10 min', price: 17.00 },
    { id: 'wifi20gb', name: 'Private Wi‑Fi 20 GB + Voice 20 min', price: 32.00 },
    { id: 'data1gb', name: 'Data 1 GB + 8 min / 7 days', price: 4.00 },
    { id: 'weekly400', name: 'Weekly Data 400/100 MB', price: 3.00 },
    { id: 'weekly800', name: 'Weekly Data 800/224 MB', price: 4.00 },
    { id: 'data14gb', name: 'Data 14 GB + YoHealth / 30 days', price: 20.00 },
    { id: 'data30gb', name: 'Data 30 GB + YoPlay', price: 38.00 },
  ];

  const getSelectedBundlePrice = () => {
    const bundle = dataBundles.find(b => b.id === selectedBundle);
    return bundle?.price || 0;
  };

  const onSubmit = async (data: EconetDataForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const bundlePrice = getSelectedBundlePrice();
      const selectedBundleInfo = dataBundles.find(b => b.id === data.bundle);
      
      const result = await processPayment({
        service: 'Econet Data Bundles',
        amount: bundlePrice,
        customerData: {
          phoneNumber: data.phoneNumber,
          bundle: selectedBundleInfo?.name || data.bundle,
          serviceType: 'data'
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
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-gray-900">Econet Data Bundles</h2>
          <p className="text-gray-600">Purchase data, voice, SMS and WhatsApp bundles</p>
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
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: (value: string) => 
              validateEconetNumber(value) || 'Please enter a valid Econet number (077/078)'
          }}
        />

        <FormField
          label="Select Data Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: 'Please select a data bundle' }}
        >
          <select
            {...register('bundle', { required: 'Please select a data bundle' })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
              errors.bundle ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Choose a bundle...</option>
            {dataBundles.map((bundle) => (
              <option key={bundle.id} value={bundle.id}>
                {bundle.name} - ${bundle.price.toFixed(2)}
              </option>
            ))}
          </select>
        </FormField>

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg"
        >
          {state.isLoading || isProcessing ? 'Processing...' : `Pay $${getSelectedBundlePrice().toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default EconetData;
