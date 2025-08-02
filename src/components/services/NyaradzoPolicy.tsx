import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validatePolicyNumber, validateZimMobileNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

interface NyaradzoPolicyForm {
  policyNumber: string;
  amount: number;
  phoneNumber: string;
}

const NYARADZO_PRODUCT_ID = 60;
const NYARADZO_PRODUCT_CODE = "NYARADZO";

const NyaradzoPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NyaradzoPolicyForm>();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);

  useEffect(() => {
    setValue("amount", selectedAmount, { shouldValidate: true });
  }, [selectedAmount, setValue]);

  const quickAmounts = [10, 20, 50, 100, 200];

  const onSubmit = async (data: NyaradzoPolicyForm) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const requestBody = {
        usd_amount: data.amount,
        productId: 15,
        productCode: '0',
        target: data.policyNumber,
        notification_phone: data.phoneNumber,
        notification: '0'
      };
      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      navigate("/make-payment", {
        state: {
          service: "Nyaradzo Policy",
          usd_amount: response.data.usd_amount,
          customerData: {
            policyNumber: response.data.target,
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
            Nyaradzo Policy
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Pay your life assurance policy
          </p>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-in slide-in-from-top duration-300">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Policy Number */}
        <FormField
          label="Policy Number"
          name="policyNumber"
          placeholder="NY12345678"
          register={register}
          error={errors.policyNumber}
          validation={{
            required: "Policy number is required",
            validate: (value: string) =>
              validatePolicyNumber(value) || "Please enter a valid policy number (e.g., NY12345678)",
          }}
        />

        {/* Payment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount (USD) <span className="text-gray-500">(Min $1, Max $10,000)</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`
                  p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 hover:scale-105
                  ${
                    selectedAmount === amt
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }
                `}
              >
                ${amt}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">${selectedAmount}</span>
            <input
              type="range"
              min={10}
              max={200}
              step={1}
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg bg-gray-200 accent-indigo-500 cursor-pointer transition-all duration-300"
            />
            <span className="text-sm text-gray-600">$200</span>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <FormField
          label="Notification Mobile Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: "Phone number is required",
            validate: (value: string) =>
              validateZimMobileNumber(value) || "Please enter a valid Zimbabwean mobile number",
          }}
        />

        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl py-3 font-semibold hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </div>
          ) : (
            `Pay $${selectedAmount.toFixed(2)}`
          )}
        </LoadingButton>
      </form>
    </div>
  );
};

export default NyaradzoPolicy;