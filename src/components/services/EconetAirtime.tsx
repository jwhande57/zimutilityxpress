import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validateEconetNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";

interface EconetAirtimeForm {
  phoneNumber: string;
}

interface AirtimeOption {
  productId: number;
  productCode: string;
  amount: number;
}

const EconetAirtime: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const { register, handleSubmit, formState: { errors } } = useForm<EconetAirtimeForm>();

  // Hardcoded airtime amounts with productId and productCode set to 0
  const airtimeOptions: AirtimeOption[] = [
    { productId: 0, productCode: "0", amount: 0.2 },
    { productId: 0, productCode: "0", amount: 0.5 },
    { productId: 0, productCode: "0", amount: 1 },
    { productId: 0, productCode: "0", amount: 2 },
    { productId: 0, productCode: "0", amount: 5 },
    { productId: 0, productCode: "0", amount: 10 },
    { productId: 0, productCode: "0", amount: 20 },
    { productId: 0, productCode: "0", amount: 50 },
  ];

  const [selectedItem, setSelectedItem] = useState<AirtimeOption | null>(null);

  const onSubmit = async (data: EconetAirtimeForm) => {
    if (!selectedItem) {
      dispatch({ type: "SET_ERROR", payload: "Please select an amount" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { productId, productCode, amount } = selectedItem;
      const requestBody = {
        usd_amount: amount,
        productId,
        productCode,
        target: data.phoneNumber,
      };
      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      navigate("/make-payment", {
        state: {
          service: "Econet Airtime",
          usd_amount: response.data.usd_amount,
          customerData: {
            phoneNumber: response.data.target,
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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-xl mx-auto">
      <div className="flex flex-wrap items-center mb-6">
        <button
          onClick={() => dispatch({ type: "SELECT_SERVICE", payload: null })}
          className="mr-4 mb-2 sm:mb-0 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ml-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Econet Airtime</h2>
          <p className="text-gray-600 text-sm">Top up your Econet line</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
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
            required: "Phone number is required",
            validate: (v: string) =>
              validateEconetNumber(v) || "Please enter a valid Econet number (077 or 078)",
          }}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {airtimeOptions.map((item) => (
              <button
                key={item.amount}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`
                  p-2 sm:p-3 rounded-xl border-2 text-sm font-medium transition-colors
                  ${
                    selectedItem?.amount === item.amount
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                ${item.amount.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
        >
          {state.isLoading
            ? "Processing…"
            : selectedItem
              ? `Pay $${selectedItem.amount.toFixed(2)}`
              : "Select an amount"
          }
        </LoadingButton>
      </form>
    </div>
  );
};

export default EconetAirtime;