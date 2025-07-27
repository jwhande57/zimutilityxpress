import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../contexts/PaymentContext';
import { validateTelOneAccount, validateZimMobileNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Wifi, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../../utils/api';
import axios from 'axios';

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

// Mock API function to simulate payment initiation
const mockApiCall = (accountNumber: string, bundle: string, phoneNumber: string, amount: number) => {
  return new Promise<{ txref: string; amountMicro: number; assetId: string; receiveAddr: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        txref: `tx_${Date.now()}`,
        amountMicro: Math.floor(amount * 1e6),
        assetId: 'USDC',
        receiveAddr: '0x1234567890abcdef',
      });
    }, 1000);
  });
};

const TelOneBroadband: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TelOneBroadbandForm>();

  const [bundles, setBundles] = useState<BundleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ stock: any[] }>(`${BASE_URL}/api/check-stock/40`);
        const mapped: BundleOption[] = response.data.stock.map(item => ({
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
      const amount = bundleInfo?.price ?? 0;
      const paymentData = await mockApiCall(data.accountNumber, data.bundle, data.phoneNumber, amount);

      navigate('/make-payment', {
        state: {
          service: 'TelOne Broadband',
          amount,
          customerData: { accountNumber: data.accountNumber, bundle: bundleInfo?.name ?? data.bundle, phoneNumber: data.phoneNumber },
          paymentData,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initiate payment' });
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
          <h2 className="text-xl font-semibold text-gray-900">TelOne Broadband</h2>
          <p className="text-gray-600">Purchase broadband packages</p>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
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
          isLoading={state.isLoading}
          className="bg-gradient-to-r from-sky-400 to-sky-500 hover:shadow-lg"
        >
          {state.isLoading ? 'Processing...' : `Pay $${getSelectedBundlePrice().toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default TelOneBroadband;