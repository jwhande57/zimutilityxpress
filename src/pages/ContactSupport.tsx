import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supportTicketService, SupportTicket } from "../services/supportTicketService";

const ContactSupport: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupportTicket>();

  const onSubmit = async (data: SupportTicket) => {
    setIsSubmitting(true);
    try {
      const response = await supportTicketService.submitTicket(data);

      if (response.success) {
        toast({
          title: "Support ticket submitted",
          description: response.message,
        });
        reset();
      } else {
        throw new Error(response.error || "Failed to submit ticket");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100 rounded-full px-3 py-2"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
          </div>
          <div className="text-center mt-4 sm:mt-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Contact Support
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-md mx-auto">
              Get help with your payment issues
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Contact Info */}
        <Card className="mb-8 bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
              <MessageCircle className="text-blue-600" size={20} />
              Quick Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="text-green-600" size={18} />
                <span className="text-gray-800">+263 4 123 456</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="text-blue-600" size={18} />
                <span className="text-gray-800">support@domain.co.zw</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="text-orange-600" size={18} />
                <span className="text-gray-800">24/7 Support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Ticket Form */}
        <Card className="bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Submit Support Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Transaction Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Reference
                </label>
                <Input
                  {...register("transactionReference", { required: true })}
                  placeholder="e.g., TXN123456789"
                  className={`w-full rounded-xl border ${errors.transactionReference ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
                {errors.transactionReference && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>

              {/* Service Accessed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Accessed
                </label>
                <select
                  {...register("serviceAccessed", { required: true })}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.serviceAccessed ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                >
                  <option value="">Select a service</option>
                  <option value="Econet Airtime">Econet Airtime</option>
                  <option value="NetOne Airtime">NetOne Airtime</option>
                  <option value="Econet Data">Econet Data Bundles</option>
                  <option value="ZESA Electricity">ZESA Electricity</option>
                  <option value="TelOne Broadband">TelOne Broadband</option>
                  <option value="Nyaradzo Policy">Nyaradzo Policy</option>
                </select>
                {errors.serviceAccessed && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select a service
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  {...register("phoneNumber", { required: true })}
                  placeholder="e.g., 077 123 4567"
                  className={`w-full rounded-xl border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    Phone number is required
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="your.email@example.com"
                  className={`w-full rounded-xl border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    Valid email is required
                  </p>
                )}
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type
                </label>
                <select
                  {...register("issueType", { required: true })}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.issueType ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                >
                  <option value="">Select issue type</option>
                  <option value="Failed Transaction">Failed Transaction</option>
                  <option value="Delayed Processing">Delayed Processing</option>
                  <option value="Incorrect Amount">Incorrect Amount</option>
                  <option value="Service Not Received">Service Not Received</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Other">Other</option>
                </select>
                {errors.issueType && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select an issue type
                  </p>
                )}
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <Textarea
                  {...register("details", { required: true })}
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                  className={`w-full rounded-xl border ${errors.details ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
                {errors.details && (
                  <p className="text-red-500 text-xs mt-1">
                    Please provide details
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:bg-opacity-90 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Support Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ContactSupport;