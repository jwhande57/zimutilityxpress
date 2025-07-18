import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  supportTicketService,
  SupportTicket,
} from "../services/supportTicketService";

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
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Top Navbar Row */}
          <div className="flex items-center justify-between">
            {/* Left Side: Back Button + Location */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>

          {/* Branding */}
          <div className="text-center mt-4 sm:mt-6">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Contact Support
            </h1>
            <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">
              Get help with your payment issues
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Contact Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="text-blue-500" size={20} />
              Quick Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="text-green-500" size={16} />
              +263 4 123 456
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-500" size={16} />
              support@domain.co.zw
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-orange-500" size={16} />
              24/7 Support
            </div>
          </CardContent>
        </Card>

        {/* Support Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Transaction Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Reference
                </label>
                <Input
                  {...register("transactionReference", { required: true })}
                  placeholder="e.g., TXN123456789"
                  className={
                    errors.transactionReference ? "border-red-500" : ""
                  }
                />
                {errors.transactionReference && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>

              {/* Service Accessed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Accessed
                </label>
                <select
                  {...register("serviceAccessed", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  {...register("phoneNumber", { required: true })}
                  placeholder="e.g., 077 123 4567"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    Phone number is required
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="your.email@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    Valid email is required
                  </p>
                )}
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Type
                </label>
                <select
                  {...register("issueType", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select issue type</option>
                  <option value="Failed Transaction">Failed Transaction</option>
                  <option value="Delayed Processing">Delayed Processing</option>
                  <option value="Incorrect Amount">Incorrect Amount</option>
                  <option value="Service Not Received">
                    Service Not Received
                  </option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <Textarea
                  {...register("details", { required: true })}
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                  className={errors.details ? "border-red-500" : ""}
                />
                {errors.details && (
                  <p className="text-red-500 text-xs mt-1">
                    Please provide details
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
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
