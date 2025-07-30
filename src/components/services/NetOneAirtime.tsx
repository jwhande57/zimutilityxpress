import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../contexts/PaymentContext";
import { validateNetOneNumber } from "../../utils/validators";
import FormField from "../FormField";
import LoadingButton from "../LoadingButton";
import { ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";

interface NetOneAirtimeForm {
  phoneNumber: string;
}

const NetOneAirtime: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePayment();
  const [stockItems, setStockItems] = useState<
    { productId: number; productCode: string; amount: number }[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<
    { productId: number; productCode: string; amount: number } | null
  >(null);
  const [amountsLoading, setAmountsLoading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NetOneAirtimeForm>();

  useEffect(() => {
    const fetchStock = async () => {
      setAmountsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/check-stock/35`);
        const items = response.data.stock.map((item: any) => ({
          productId: item.productId,
          productCode: item.productCode,
          amount: item.amount,
        }));
        setStockItems(items);
      } catch (error: any) {
        console.error("Failed to fetch stock:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load stock amounts",
        });
      } finally {
        setAmountsLoading(false);
      }
    };
    fetchStock();
  }, [dispatch]);

  const onSubmit = async (data: NetOneAirtimeForm) => {
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
          service: "NetOne Airtime",
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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-lg mx-auto transition-all hover:shadow-2xl animate-in fade-in duration-500">
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
            NetOne Airtime
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Top up your NetOne line
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
          placeholder="071 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: "Phone number is required",
            validate: (value: string) =>
              validateNetOneNumber(value) ||
              "Please enter a valid NetOne number (071)",
          }}
        />

        {/* Airtime Amounts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>
          {amountsLoading ? (
            <div className="flex justify-center py-6">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-4 border-orange-400/50 rounded-full animate-pulse" />
              </div>
            </div>
          ) : stockItems.length === 0 ? (
            <p className="text-red-500 text-sm">No airtime amounts available</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {stockItems.map((item) => (
                <button
                  key={item.productCode}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`
                    p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 hover:scale-105
                    ${
                      selectedItem?.productCode === item.productCode
                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50/50"
                    }
                  `}
                >
                  ${item.amount.toFixed(2)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl py-3 font-semibold hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </div>
          ) : selectedItem ? (
            `Pay $${selectedItem.amount.toFixed(2)}`
          ) : (
            "Select an amount"
          )}
        </LoadingButton>
      </form>
    </div>
  );
};

export default NetOneAirtime;