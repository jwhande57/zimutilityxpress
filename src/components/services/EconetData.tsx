import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validateEconetNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";

// Define form data interface
interface EconetDataForm {
  phoneNumber: string;
  bundle: string;
}

// Define bundle option interface
interface BundleOption {
  productId: number;
  id: string;
  name: string;
  price: number;
}

// EconetData component: allows users to purchase Econet data bundles
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

  // Fetch available bundles when the component mounts
  useEffect(() => {
    const fetchBundles = async () => {
      setBundlesLoading(true);
      try {
        const response = await axios.get<{ stock: any[] }>(
          `${BASE_URL}/api/check-stock/111`
        );
        const mapped = response.data.stock.map((item) => ({
          productId: item.productId,
          id: item.productCode,
          name: item.name,
          price: item.amount,
        }));
        setDataBundles(mapped);
        if (mapped.length) {
          setValue("bundle", mapped[0].id); // Set default bundle
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

  // Watch the selected bundle ID to calculate the price
  const selectedBundleId = watch("bundle");
  const getSelectedBundlePrice = () => {
    const bundle = dataBundles.find((b) => b.id === selectedBundleId);
    return bundle?.price ?? 0;
  };
  // Handle form submission when "Pay" button is clicked
  const onSubmit = async (data: EconetDataForm) => {
    // Indicate that the payment process is starting
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Find the selected bundle from the list
      const bundle = dataBundles.find((b) => b.id === data.bundle);

      if (!bundle) {
        throw new Error("Selected bundle not found");
      }
      const amount = bundle.price;

      // Construct the request body as per requirements
      const requestBody = {
        usd_amount: amount, // Price of the selected bundle
        productId: bundle.productId, // Product ID from bundle
        productCode: bundle.id, // Product code from bundle
        target: data.phoneNumber, // Phone number as target
      };

      // Send POST request to api/order endpoint
      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      // Ensure API call was successful, then navigate with response data
      navigate("/make-payment", {
        state: {
          service: "Econet Bundles",
          usd_amount: response.data.usd_amount,
          customerData: {
            phoneNumber: response.data.target,
            bundle: bundle?.name ?? data.bundle,
          },
          txref: response.data.txref,
          payment_link: response.data.payment_link,
        },
      });
    } catch (error) {
      // Handle and display errors if the API call fails
      let errorMessage = "Failed to initialize payment, please try again";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      // Reset loading state regardless of success or failure
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header with back button and title */}
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

      {/* Display submission error if it exists */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {state.error}
        </div>
      )}
      {/* Display bundle fetch error if it exists */}
      {fetchError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-4 text-sm">
          Could not load bundles: {fetchError}
        </div>
      )}

      {/* Form for entering phone number and selecting bundle */}
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

        {/* Pay button with loading state */}
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
