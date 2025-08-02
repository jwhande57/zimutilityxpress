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
  amount: number;
}

interface AirtimeOption {
  productId: number;
  productCode: string;
  amount: number;
}

const EconetAirtime: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EconetAirtimeForm>({
    defaultValues: {
      phoneNumber: "",
      amount: 0,
    },
  });

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
  const [customAmount, setCustomAmount] = useState<number>(0);

  // Update form value when custom amount or selected item changes
  const handleAmountChange = (amount: number) => {
    if (amount >= 0.20 && amount <= 100) {
      setCustomAmount(amount);
      setSelectedItem(null);
      setValue("amount", amount, { shouldValidate: true });
    } else if (!amount) {
      setCustomAmount(0);
      setSelectedItem(null);
      setValue("amount", 0, { shouldValidate: true });
    }
  };

  const handleSelectItem = (item: AirtimeOption) => {
    setSelectedItem(item);
    setCustomAmount(0);
    setValue("amount", item.amount, { shouldValidate: true });
  };

  const onSubmit = async (data: EconetAirtimeForm) => {
    if (!data.amount && !selectedItem) {
      dispatch({ type: "SET_ERROR", payload: "Please select or enter an amount" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const amount = selectedItem ? selectedItem.amount : data.amount;
      const productId = 101;
      const productCode = "0";
      const requestBody = {
        usd_amount: amount,
        productId,
        productCode,
        target: data.phoneNumber,
        notification_phone: data.phoneNumber,
        notification: '0'
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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-lg mx-auto transition-all hover:shadow-2xl animate-in fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => dispatch({ type: "SELECT_SERVICE", payload: null })}
          className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-all duration-300"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
        <div className="ml-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Econet Airtime
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Top up your Econet line
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
        {/* Phone Number */}
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

        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter or Select Amount (USD) <span className="text-gray-500">(Min $0.10, Max $100)</span>
          </label>

          {/* Custom Amount Input */}
          <div className="relative mb-4 group">
            <input
              type="number"
              step="0.01"
              min="0.10"
              max="100"
              value={customAmount || ""}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full px-4 py-3 pl-8 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:shadow-md group-hover:bg-white"
              placeholder="Enter amount (e.g., 1.50)"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300">$</span>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mb-4">{errors.amount.message}</p>
          )}

          {/* Predefined Amounts */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Quick Select Amounts:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-in fade-in duration-300">
              {airtimeOptions.map((item) => (
                <button
                  key={item.amount}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className={`
                    p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 hover:scale-105
                    ${
                      selectedItem?.amount === item.amount
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                    }
                  `}
                >
                  ${item.amount.toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden Amount Field for Form Submission */}
        <input
          type="hidden"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.10, message: "Amount must be at least $0.10" },
            max: { value: 100, message: "Amount cannot exceed $100" },
          })}
        />

        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 font-semibold hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </div>
          ) : selectedItem || customAmount ? (
            `Pay $${(selectedItem?.amount || customAmount).toFixed(2)}`
          ) : (
            "Select or enter an amount"
          )}
        </LoadingButton>
      </form>
    </div>
  );
};

export default EconetAirtime;