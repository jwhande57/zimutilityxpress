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
  productId: number; // ← new
  id: string; // this is productCode
  name: string;
  price: number;
}

const mockApiCall = (phoneNumber: string, bundle: string, amount: number) => {
  return new Promise<{
    txref: string;
    amountMicro: number;
    assetId: string;
    receiveAddr: string;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        txref: `tx_${Date.now()}`,
        amountMicro: Math.floor(amount * 1e6),
        assetId: "USDC",
        receiveAddr: "0x1234567890abcdef",
      });
    }, 1000);
  });
};

const EconetData: React.FC = () => {
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
          `${BASE_URL}/api/check-stock/111`
        );
        const mapped = response.data.stock.map((item) => ({
          productId: item.productId, // ← capture productId
          id: item.productCode, // ← this stays as id
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
      const amount = bundle?.price ?? 0;
      const paymentData = await mockApiCall(
        data.phoneNumber,
        data.bundle,
        amount
      );

      navigate("/make-payment", {
        state: {
          service: "Econet Data Bundles",
          amount,
          customerData: {
            phoneNumber: data.phoneNumber,
            bundle: bundle?.name ?? data.bundle,
          },
          paymentData,
          productId: bundle?.productId, // ← pass through
          productCode: bundle?.id, // ← pass through
        },
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to initiate payment" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => dispatch({ type: "SELECT_SERVICE", payload: null })}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Econet Data Bundles
          </h2>
          <p className="text-gray-600">
            Purchase data, voice, SMS and WhatsApp bundles
          </p>
        </div>
      </div>

      {fetchError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-4 text-sm">
          Could not load bundles: {fetchError}
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
            required: "Phone number is required",
            validate: (value: string) =>
              validateEconetNumber(value) ||
              "Please enter a valid Econet number (077/078)",
          }}
        />

        <FormField
          label="Select Data Bundle"
          name="bundle"
          register={register}
          error={errors.bundle}
          validation={{ required: "Please select a data bundle" }}
        >
          {bundlesLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <select
              {...register("bundle", {
                required: "Please select a data bundle",
              })}
              disabled={bundlesLoading}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.bundle ? "border-red-500" : "border-gray-300"
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
          isLoading={state.isLoading}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg"
        >
          {state.isLoading
            ? "Processing..."
            : `Pay $${getSelectedBundlePrice().toFixed(2)}`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default EconetData;
