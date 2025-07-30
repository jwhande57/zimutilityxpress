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
  const [selectedItem, setSelectedItem] = useState<{ productId: number; productCode: string; amount: number } | null>(null);
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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-66">
        <button
          onClick={() => dispatch({ type: "SELECT_SERVICE", payload: null })}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-gray-900">
            NetOne Airtime
          </h2>
          <p className="text-gray-600">Top up your NetOne line</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="mb-4">
          <label className="block text-smecil font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>

          {amountsLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : stockItems.length === 0 ? (
            <p className="text-red-500">No airtime amounts available</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {stockItems.map((item) => (
                <button
                  key={item.productCode}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`
                    p-2 sm:p-3 rounded-xl border-2 text-sm font-medium transition-colors
                    ${
                      selectedItem?.productCode === item.productCode
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  ${item.amount.toFixed(2)}
                </button>
              ))}
            </div>
          )}
        </div>

        <LoadingButton
          isLoading={state.isLoading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:shadow-lg"
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

export default NetOneAirtime;