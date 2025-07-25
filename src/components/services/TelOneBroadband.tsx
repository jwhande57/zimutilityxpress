// "productId": 41

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateTelOneAccount, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Wifi, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../../utils/api';

interface TelOneBroadbandForm {
  accountNumber: string;
  bundle: string;
  phoneNumber: string;
}

interface BundleOption {
  id: string;
  name: string;
  price: number;
}

const TelOneBroadband: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TelOneBroadbandForm>();

  // --- local state for fetched bundles ---
  const [bundles, setBundles] = useState<BundleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetch on mount
  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/check-stock/40`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as { stock: any[] };
        const mapped: BundleOption[] = json.stock.map(item => ({
          id: item.productCode,
          name: item.name,
          price: item.amount,
        }));
        setBundles(mapped);
        if (mapped.length) {
          setValue('bundle', mapped[0].id);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load bundles');
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, [setValue]);

  const selectedBundleId = watch('bundle');
  const getSelectedBundlePrice = () => {
    const b = bundles.find(x => x.id === selectedBundleId);
    return b?.price ?? 0;
  };

  const onSubmit = async (data: TelOneBroadbandForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const bundleInfo = bundles.find(b => b.id === data.bundle);
      const result = await processPayment({
        service: 'TelOne Broadband',
        amount: bundleInfo?.price ?? 0,
        customerData: {
          accountNumber: data.accountNumber,
          bundle: bundleInfo?.name ?? data.bundle,
          phoneNumber: data.phoneNumber,
          serviceType: 'broadband',
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
          <h2 className="text-xl font-semibold text-gray-900">TelOne Broadband</h2>
          <p className="text-gray-600">Purchase broadband packages</p>
        </div>
      </div>

      {/* Load error */}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Account Number"
          name="accountNumber"
          placeholder="123456"
          register={register}
          error={errors.accountNumber}
          validation={{
            required: 'Account number is required',
            validate: v => validateTelOneAccount(v) || 'Please enter a valid TelOne account number',
          }}
        />

        <FormField
          label="Select Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: 'Please select a bundle' }}
        >
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : (
            <select
              {...register('bundle', { required: 'Please select a bundle' })}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.bundle ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a bundle...</option>
              {bundles.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} – ${b.price.toFixed(2)}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label="Notification Mobile Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: v => validateZimMobileNumber(v) || 'Please enter a valid Zimbabwean mobile number',
          }}
        />

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          disabled={loading}
          className="bg-gradient-to-r from-sky-400 to-sky-500 hover:shadow-lg"
        >
          {state.isLoading || isProcessing
            ? 'Processing...'
            : `Pay $${getSelectedBundlePrice().toFixed(2)}`
          }
        </LoadingButton>
      </form>
    </div>
  );
};

export default TelOneBroadband;
