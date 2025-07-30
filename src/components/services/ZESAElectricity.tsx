import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validateMeterNumber, validateZimMobileNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { Zap, ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";

interface ZESAElectricityForm {
  meterNumber: string;
  phoneNumber: string;
}

const ZESA_PRODUCT_ID = 50;
const ZESA_PRODUCT_CODE = "ZESA";

const ZESAElectricity: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const { register, handleSubmit, formState: { errors } } = useForm<ZESAElectricityForm>();

  const quickAmounts = [5, 10, 20, 50, 100];

  const onSubmit = async (data: ZESAElectricityForm) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const amount = selectedAmount;
      const requestBody = {
        usd_amount: amount,
        productId: ZESA_PRODUCT_ID,
        productCode: ZESA_PRODUCT_CODE,
        target: data.meterNumber,
      };
      const response = await axios.post(`${BASE_URL}/api/order`, requestBody);

      navigate("/make-payment", {
        state: {
          service: "ZESA Electricity",
          usd_amount: response.data.usd_amount,
          customerData: {
            meterNumber: response.data.target,
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
            ZESA Electricity
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Purchase electricity tokens
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
        {/* Meter Number */}
        <FormField
          label="Meter Number"
          name="meterNumber"
          placeholder="12345678901"
          register={register}
          error={errors.meterNumber}
          
          validation={{
            required: "Meter number is required",
            validate: (v) => validateMeterNumber(v) || "Please enter a valid 11-digit meter number",
          }}
        />

        {/* Phone Number */}
        <FormField
          label="Notification Phone Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: "Phone number is required",
            validate: (v) =>
              validateZimMobileNumber(v) || "Please enter a valid Zimbabwean mobile number",
          }}
        />

        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USD) <span className="text-gray-500">(Min $5, Max $500)</span>
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
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-yellow-300 hover:bg-yellow-50/50"
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
              min={5}
              max={500}
              step={1}
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg bg-gray-200 accent-yellow-500 cursor-pointer transition-all duration-300"
            />
            <span className="text-sm text-gray-600">$500</span>
          </div>
        </div>

        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl py-3 font-semibold hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
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

export default ZESAElectricity;