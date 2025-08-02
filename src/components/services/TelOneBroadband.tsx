import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validateTelOneAccount, validateZimMobileNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { Wifi, ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";

interface TelOneBroadbandForm {
  accountNumber: string;
  bundle: string;
  phoneNumber: string;
}

interface BundleOption {
  productId: number;
  id: string;
  name: string;
  price: number;
}

const TelOneBroadband: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TelOneBroadbandForm>();

  const [bundles, setBundles] = useState<BundleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ stock: any[] }>(
          `${BASE_URL}/api/check-stock/40`
        );
        const mapped: BundleOption[] = response.data.stock.map((item) => ({
          productId: item.productId,
          id: item.productCode,
          name: item.name,
          price: item.amount,
        }));
        setBundles(mapped);
        if (mapped.length) {
          setValue("bundle", mapped[0].id);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load bundles");
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, [setValue]);

  const selectedBundleId = watch("bundle");
  const getSelectedBundlePrice = () => {
    const b = bundles.find((x) => x.id === selectedBundleId);
    return b?.price ?? 0;
  };

  const onSubmit = async (data: TelOneBroadbandForm) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const bundle = bundles.find((b) => b.id === data.bundle);
      if (!bundle) {
        throw new Error("Selected bundle not found");
      }
      const amount = bundle.price;

      const requestBody = {
        usd_amount: amount,
        productId: bundle.productId,
        productCode: bundle.id,
        target: data.accountNumber,
        notification_phone: data.phoneNumber,
        notification: "Your TelOne Broadband bundle %BUNDLE% has been added to your account. You're all set to browse, stream, and stay connected.",
      };

      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      navigate("/make-payment", {
        state: {
          service: "TelOne Broadband",
          usd_amount: response.data.usd_amount,
          customerData: {
            accountNumber: response.data.target,
            bundle: bundle.name,
            phoneNumber: data.phoneNumber,
          },
          txref: response.data.txref,
          payment_link: response.data.payment_link,
        },
      });
    } catch (error) {
      let errorMessage = "Failed to initialize payment, please try again";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-lg mx-auto transition-all hover:shadow-2xl animate-in fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => dispatch({ type: "SELECT_SERVICE", payload: null })}
          className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-all duration-300"
        >
          <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
        <div className="ml-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            TelOne Broadband
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Purchase broadband packages
          </p>
        </div>
      </div>

      {/* Errors */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-in slide-in-from-top duration-300">
          {state.error}
        </div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-6 text-sm animate-in slide-in-from-top duration-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Account Number */}
        <FormField
          label="Account Number"
          name="accountNumber"
          placeholder="123456"
          register={register}
          error={errors.accountNumber}
          validation={{
            required: "Account number is required",
            validate: (v) =>
              validateTelOneAccount(v) ||
              "Please enter a valid TelOne account number",
          }}
        />

        {/* Bundle Selection */}
        <FormField
          label="Select Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: "Please select a bundle" }}
        >
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-4 border-sky-400/50 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <select
              {...register("bundle", { required: "Please select a bundle" })}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.bundle ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300`}
            >
              <option value="">Choose a bundle...</option>
              {bundles.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} – ${b.price.toFixed(2)}
                </option>
              ))}
            </select>
          )}
        </FormField>

        {/* Phone Number */}
        <FormField
          label="Notification Mobile Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: "Phone number is required",
            validate: (v) =>
              validateZimMobileNumber(v) ||
              "Please enter a valid Zimbabwean mobile number",
          }}
        />

        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl py-3 font-semibold hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </div>
          ) : (
            `Pay $${getSelectedBundlePrice().toFixed(2)}`
          )}
        </LoadingButton>
      </form>
    </div>
  );
};

export default TelOneBroadband;