import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import LoadingButton from "../components/LoadingButton";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

interface LocationState {
  service: string;
  amount: number;
  customerData: Record<string, string>; // Flexible customer data for different services
  paymentData: {
    txref: string;
    amountMicro: number;
    assetId: string;
    receiveAddr: string;
  };
}

// Simulated API call
const mockConfirm = (): Promise<boolean> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(Math.random() < 0.7), 2000)
  );

const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const { service, amount, customerData, paymentData } = useLocation()
    .state as LocationState;

  console.log(`PaymentGateway: ${JSON.stringify(useLocation().state)}`);

  const [step, setStep] = useState<"qr" | "confirm">("qr");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const transactionId = paymentData.txref; // Use txref from paymentData
  const [timestamp] = useState(() => new Date().toLocaleString());

  const handleConfirm = async () => {
    setIsProcessing(true);
    const result = await mockConfirm();
    setPaymentSuccess(result);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setStep("qr");
    setPaymentSuccess(null);
  };

  const qrValue = JSON.stringify({
    service,
    amount,
    customerData,
    paymentData,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 text-center flex-1">
              {service}
            </h1>
            <div className="w-5" />
          </div>

          {step === "qr" && (
            <>
              {/* QR Section */}
              <div className="text-center mb-6">
                <h2 className="text-gray-800 font-medium mb-2">Scan to Pay</h2>
                <div className="bg-white p-4 rounded-xl shadow-inner inline-block">
                  <QRCode value={qrValue} size={140} />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Or{" "}
                  <button
                    className="text-green-600 underline"
                    onClick={() => window.open("mywallet://pay", "_blank")}
                  >
                    open your wallet
                  </button>
                </p>
              </div>

              {/* Transaction Summary */}
              <div className="bg-gray-100 rounded-2xl p-5 mb-6 shadow-inner">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Transaction Summary
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium text-gray-900">{service}</span>
                  </div>

                  {/* Dynamically display all customer data */}
                  {Object.entries(customerData).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-gray-700">
                      {transactionId}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center text-base font-semibold">
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-green-600">${amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <LoadingButton
                isLoading={isProcessing}
                onClick={() => {
                  setStep("confirm");
                  handleConfirm();
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
              >
                Confirm Payment
              </LoadingButton>
            </>
          )}

          {step === "confirm" && (
            <>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-solid mb-4" />
                  <p className="text-green-700 font-semibold text-lg">
                    Processing your payment...
                  </p>
                </div>
              ) : paymentSuccess !== null ? (
                <div
                  className={`rounded-2xl p-6 shadow-md ${
                    paymentSuccess ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {paymentSuccess ? (
                    <>
                      <div className="flex flex-col items-center text-green-700">
                        <CheckCircle2 size={64} className="mb-4" />
                        <h2 className="text-2xl font-bold mb-2">
                          Payment Successful
                        </h2>
                        <p className="mb-6 text-gray-700 text-center max-w-sm">
                          Thank you for your transaction. Your payment has been
                          processed successfully.
                        </p>

                        <div className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6">
                          <h3 className="font-semibold mb-3 text-gray-800">
                            Transaction Details
                          </h3>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Service:</span>
                              <span className="font-medium">{service}</span>
                            </div>
                            {/* Dynamically display all customer data */}
                            {Object.entries(customerData).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-600">{key}:</span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              )
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Transaction ID:
                              </span>
                              <span className="font-mono">{transactionId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Amount Paid:
                              </span>
                              <span className="font-medium text-green-600">
                                ${amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Date & Time:
                              </span>
                              <span>{timestamp}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate("/")}
                          className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
                        >
                          Return Home
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center text-red-700">
                        <XCircle size={64} className="mb-4" />
                        <h2 className="text-2xl font-bold mb-2">
                          Payment Failed
                        </h2>
                        <p className="mb-6 text-gray-700 text-center max-w-sm">
                          Unfortunately, the transaction was not completed.
                          Please try again.
                        </p>

                        <button
                          onClick={handleReset}
                          className="px-6 py-2 bg-red-600 text-white rounded-xl font.PLAINmedium hover:bg-red-700 transition"
                        >
                          Retry Payment
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            This is a simulated payment process. In production, this would
            connect to a real payment gateway.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
