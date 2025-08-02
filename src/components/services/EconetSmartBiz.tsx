import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validateEconetNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { Smartphone, ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";

interface EconetDataForm {
  phoneNumber: string;
  bundle: string;
}

interface BundleOption {
  productId: number;
  id: string;
  name: string;
  price: number;
}

const EconetSmartBiz: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EconetDataForm>();

  const [dataBundles, setDataBundles] = useState<BundleOption[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundles = async () => {
      setBundlesLoading(true);
      try {
        const response = await axios.get<{ stock: any[] }>(
          `${BASE_URL}/api/check-stock/47`
        );
        const mapped = response.data.stock.map((item) => ({
          productId: item.productId,
          id: item.productCode,
          name: item.name,
          price: item.amount,
        }));
        setDataBundles(mapped);
        if (mapped.length) {
          setValue("bundle", mapped[0].id);
        }
      } catch (err: any) {
        console.error(err);
        setFetchError(err.message || "Unknown error");
      } finally {
        setBundlesLoading(false);
      }
    };
    fetchBundles();
  }, [setValue]);

  const selectedBundleId = watch("bundle");
  const getSelectedBundlePrice = () => {
    const bundle = dataBundles.find((b) => b.id === selectedBundleId);
    return bundle?.price ?? 0;
  };

  const onSubmit = async (data: EconetDataForm) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const bundle = dataBundles.find((b) => b.id === data.bundle);
      if (!bundle) {
        throw new Error("Selected bundle not found");
      }
      const amount = bundle.price;

      const requestBody = {
        usd_amount: amount,
        productId: bundle.productId,
        productCode: bundle.id,
        target: data.phoneNumber,
      };

      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      navigate("/make-payment", {
        state: {
          service: "Econet SmartBiz",
          usd_amount: response.data.usd_amount,
          customerData: {
            phoneNumber: response.data.target,
            bundle: bundle.name,
          },
          txref: response.data.txref,
          payment_link: response.data.payment_link,
          notification_phone: data.phoneNumber,
          notification: "Your Econet SmartBiz bundle %BUNDLE% has been added to your account. You're all set to browse, stream, and stay connected.",
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
            Econet SmartBiz
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Purchase unlimited data bundle
          </p>
        </div>
      </div>

      {/* Errors */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-in slide-in-from-top duration-300">
          {state.error}
        </div>
      )}
      {fetchError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-6 text-sm animate-in slide-in-from-top duration-300">
          Could not load bundles: {fetchError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Phone Number */}
        <FormField
          label="Phone Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: "Phone number is required",
            validate: (value: string) =>
              validateEconetNumber(value) ||
              "Please enter a valid Econet number (077/078)",
          }}
        />

        {/* Bundle Selection */}
        <FormField
          label="Select Data Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: "Please select a data bundle" }}
        >
          {bundlesLoading ? (
            <div className="flex justify-center py-6">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-4 border-blue-400/50 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <select
              {...register("bundle", {
                required: "Please select a data bundle",
              })}
              disabled={bundlesLoading}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.bundle ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-300`}
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

        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl py-3 font-semibold hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
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

export default EconetSmartBiz;