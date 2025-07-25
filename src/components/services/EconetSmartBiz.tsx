import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateEconetNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../../utils/api';


interface EconetDataForm {
  phoneNumber: string;
  bundle: string;
}

interface BundleOption {
  id: string;
  name: string;
  price: number;
}

const EconetSmartBiz: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { processPayment, isProcessing } = usePaymentProcessing();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<EconetDataForm>();

  // --- dynamic bundle state & loading ---
  const [dataBundles, setDataBundles] = useState<BundleOption[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 1) fetch on mount
  useEffect(() => {
    const fetchBundles = async () => {
      setBundlesLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/check-stock/47`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as { stock: any[] };
        const mapped = json.stock.map(item => ({
          id: item.productCode,
          name: item.name,
          price: item.amount,
        }));
        setDataBundles(mapped);

        // default-select first bundle
        if (mapped.length) {
          setValue('bundle', mapped[0].id);
        }
      } catch (err: any) {
        console.error(err);
        setFetchError(err.message || 'Unknown error');
      } finally {
        setBundlesLoading(false);
      }
    };
    fetchBundles();
  }, [setValue]);

  // reflect selected bundle in form
  const selectedBundleId = watch('bundle');

  // helper to get price
  const getSelectedBundlePrice = () => {
    const bundle = dataBundles.find(b => b.id === selectedBundleId);
    return bundle?.price ?? 0;
  };

  const onSubmit = async (data: EconetDataForm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const bundle = dataBundles.find(b => b.id === data.bundle);
      const result = await processPayment({
        service: 'Econet Data Bundles',
        amount: bundle?.price ?? 0,
        customerData: {
          phoneNumber: data.phoneNumber,
          bundle: bundle?.name ?? data.bundle,
          serviceType: 'data',
        },
      });

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Payment processing failed' });
      }
    } catch (err) {
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
          <h2 className="text-xl font-semibold text-gray-900">Econet SmartBiz</h2>
          <p className="text-gray-600">Purchase Unlimited Data Bundle</p>
        </div>
      </div>

      {/* Loading error */}
      {fetchError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-4 text-sm">
          Could not load bundles: {fetchError}
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
            validate: (value: string) =>
              validateEconetNumber(value) || 'Please enter a valid Econet Smartbiz number (077/078)',
          }}
        />

        <FormField
          label="Select Data Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: 'Please select a data bundle' }}
        >
          {bundlesLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <select
              {...register('bundle', { required: 'Please select a data bundle' })}
              disabled={bundlesLoading}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.bundle ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a bundle...</option>
              {dataBundles.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} – ${b.price.toFixed(2)}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          disabled={bundlesLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg"
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

export default EconetSmartBiz;
