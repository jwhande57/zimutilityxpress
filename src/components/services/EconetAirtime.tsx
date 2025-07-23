
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateEconetNumber } from '../../utils/validators';
import { mockApiService, StockData, StockAvailability } from '../../services/mockApi';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * Econet Airtime Form Interface
 * Defines the structure of the form data for Econet airtime purchases
 */
interface EconetAirtimeForm {
  phoneNumber: string;  // Customer's Econet phone number
}

/**
 * EconetAirtime Component
 * Handles Econet airtime top-up purchases with predefined amount selection
 * Validates Econet phone numbers and processes payments through the payment gateway
 */
const EconetAirtime: React.FC = () => {
  // Get payment context state and dispatch function
  const { state, dispatch } = usePayment();
  
  // Get payment processing functions and loading state
  const { processPayment, isProcessing } = usePaymentProcessing();
  
  // Local state for selected airtime amount
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  
  // Stock availability state
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  
  // Initialize react-hook-form with validation
  const { register, handleSubmit, formState: { errors } } = useForm<EconetAirtimeForm>();

  // Predefined airtime amounts in USD for quick selection
  const predefinedAmounts = [0.50, 1, 2, 5, 10, 20, 50];

  /**
   * Fetch stock availability data
   */
  const fetchStockData = async () => {
    setIsLoadingStock(true);
    setStockError(null);
    
    try {
      const response = await mockApiService.getStockAvailability('Econet Airtime');
      
      if (response.success && response.data) {
        setStockData(response.data);
        
        // Check if currently selected amount is still available
        const selectedAmountStock = response.data.amounts.find(
          (stock: StockAvailability) => stock.amount === selectedAmount
        );
        
        if (selectedAmountStock && !selectedAmountStock.available) {
          // Find first available amount as fallback
          const firstAvailable = response.data.amounts.find(
            (stock: StockAvailability) => stock.available
          );
          
          if (firstAvailable) {
            setSelectedAmount(firstAvailable.amount);
          }
        }
      } else {
        setStockError(response.error || 'Failed to fetch stock data');
      }
    } catch (error) {
      setStockError('Failed to fetch stock data');
      console.error('Stock fetch error:', error);
    } finally {
      setIsLoadingStock(false);
    }
  };

  // Fetch stock data on component mount
  useEffect(() => {
    fetchStockData();
  }, []);

  // Get available amounts for rendering
  const getAvailableAmounts = (): StockAvailability[] => {
    if (!stockData) return [];
    return stockData.amounts.filter(stock => stock.available);
  };

  /**
   * Form submission handler
   * Processes the payment when user submits the form
   * 
   * @param data - Validated form data containing phone number
   */
  const onSubmit = async (data: EconetAirtimeForm) => {
    // Set global loading state
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Process payment with service-specific data
      const result = await processPayment({
        service: 'Econet Airtime',           // Service identifier
        amount: selectedAmount,              // Selected airtime amount
        customerData: {
          phoneNumber: data.phoneNumber,     // Customer's phone number
          serviceType: 'airtime'             // Type of service for backend processing
        }
      });
      // Handle successful payment processing
      if (result.success && result.redirectUrl) {
        // Redirect to payment gateway for actual payment
        window.location.href = result.redirectUrl;
      } else {
        // Set error message if processing failed
        dispatch({ 
          type: 'SET_ERROR', 
          payload: result.error || 'Payment processing failed' 
        });
      }
    } catch (error) {
      // Handle unexpected errors
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Payment processing failed. Please try again.' 
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-xl mx-auto">
      {/* Header Section with Back Button and Service Info */}
      <div className="flex flex-wrap items-center mb-6">
        <button
          onClick={() => dispatch({ type: 'SELECT_SERVICE', payload: null })}
          className="mr-4 mb-2 sm:mb-0 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>
  
        <div className="ml-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Econet Airtime</h2>
          <p className="text-gray-600 text-sm">Top up your Econet line</p>
        </div>
      </div>
  
      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {state.error}
        </div>
      )}
  
      {/* Payment Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Phone Number Input Field */}
        <FormField
          label="Phone Number"
          name="phoneNumber"
          placeholder="077 123 4567"
          register={register}
          error={errors.phoneNumber}
          validation={{
            required: 'Phone number is required',
            validate: (value: string) => 
              validateEconetNumber(value) || 'Please enter a valid Econet number (077 or 078)'
          }}
        />
  
        {/* Amount Selection Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Amount (USD)
            </label>
            <button
              type="button"
              onClick={fetchStockData}
              disabled={isLoadingStock}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoadingStock ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Stock Error Message */}
          {stockError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg mb-3 text-sm">
              {stockError}
            </div>
          )}

          {/* Loading State */}
          {isLoadingStock && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading available amounts...</span>
            </div>
          )}

          {/* Amount Selection Grid */}
          {!isLoadingStock && stockData && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {getAvailableAmounts().map((stock) => (
                <button
                  key={stock.amount}
                  type="button"
                  onClick={() => setSelectedAmount(stock.amount)}
                  disabled={!stock.available}
                  className={`
                    relative p-2 sm:p-3 rounded-xl border-2 text-sm font-medium transition-all
                    ${selectedAmount === stock.amount
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }
                    ${!stock.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">${stock.amount}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {stock.available ? `${stock.stock} left` : 'Out of stock'}
                    </span>
                  </div>
                  {selectedAmount === stock.amount && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No Stock Available Message */}
          {!isLoadingStock && stockData && getAvailableAmounts().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No amounts currently available. Please try again later.</p>
            </div>
          )}
        </div>
  
        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
          type="submit"
        >
          {state.isLoading || isProcessing
            ? 'Processing...'
            : `Pay $${selectedAmount.toFixed(2)}`
          }
        </LoadingButton>
      </form>
    </div>
  );
};

export default EconetAirtime;
