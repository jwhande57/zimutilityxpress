
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment } from '../../contexts/PaymentContext';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { validateEconetNumber } from '../../utils/validators';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import { Phone,ArrowLeft } from 'lucide-react';
import econetLogo from "../../assets/econet.png";


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
  
  // Initialize react-hook-form with validation
  const { register, handleSubmit, formState: { errors } } = useForm<EconetAirtimeForm>();

  // Predefined airtime amounts in USD for quick selection
  const predefinedAmounts = [0.50, 1, 2, 5, 10, 20, 50];

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount (USD)
          </label>
  
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={`
                  p-2 sm:p-3 rounded-xl border-2 text-sm font-medium transition-colors
                  ${selectedAmount === amount
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'}
                `}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
  
        {/* Submit Button */}
        <LoadingButton
          isLoading={state.isLoading || isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
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
