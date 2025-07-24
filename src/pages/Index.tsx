import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { PaymentProvider, usePayment } from "../contexts/PaymentContext";
import ServiceCard from "../components/ServiceCard";
import EconetAirtime from "../components/services/EconetAirtime";
import NetOneAirtime from "../components/services/NetOneAirtime";
import EconetData from "../components/services/EconetData";
import ZESAElectricity from "../components/services/ZESAElectricity";
import TelOneBroadband from "../components/services/TelOneBroadband";
import NyaradzoPolicy from "../components/services/NyaradzoPolicy";
import EconetSmartBiz from "../components/services/EconetSmartBiz";

import econetLogo from "../assets/econet.png";
import netoneLogo from "../assets/netone.jpg";
import econetDataLogo from "../assets/econet-data.png";
import zesaLogo from "../assets/zesa.png";
import teloneLogo from "../assets/telonw.png";
import nyaradzoLogo from "../assets/nyaradzo.jpg";
import smartbizLogo from "../assets/smartbiz.png";

const MainContent: React.FC = () => {
  const { state } = usePayment();

  const renderSelectedService = () => {
    switch (state.selectedService) {
      case "econet-airtime":
        return <EconetAirtime />;
      case "netone-airtime":
        return <NetOneAirtime />;
      case "econet-data":
        return <EconetData />;
      case "zesa-electricity":
        return <ZESAElectricity />;
      case "telone-broadband":
        return <TelOneBroadband />;
      case "nyaradzo-policy":
        return <NyaradzoPolicy />;
      case "econet-smartbiz":
        return <EconetSmartBiz />;
      default:
        return null;
    }
  };

  if (state.selectedService) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">{renderSelectedService()}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Top Navbar Row */}
          <div className="flex items-center justify-between">
            {/* Left Side: Flag + Location */}
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🇿🇼</span>
              <span className="text-sm text-gray-600 hidden sm:inline">
                Zimbabwe
              </span>
            </div>

            {/* Right Side: Support Link */}
            <Link
              to="/support"
              className="p-2 flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Support</span>
            </Link>
          </div>

          {/* Branding */}
          <div className="text-center mt-4 sm:mt-6">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Utility Xpress
            </h1>
            <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">
              Top up, pay bills, and purchase services instantly
            </p>
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ServiceCard
            id="econet-airtime"
            title="Econet Airtime"
            description="Top up your Econet mobile line instantly"
            logoSrc={econetLogo}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            badge="Popular"
          />
          <ServiceCard
            id="netone-airtime"
            title="NetOne Airtime"
            description="Top up your NetOne mobile line instantly"
            logoSrc={netoneLogo}
            gradient="bg-gradient-to-r from-orange-400 to-orange-500"
          />
          <ServiceCard
            id="econet-data"
            title="Econet Data Bundles"
            description="Purchase data, voice, SMS and WhatsApp bundles"
            logoSrc={econetDataLogo}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <ServiceCard
            id="telone-broadband"
            title="TelOne Broadband"
            description="Purchase TelOne internet packages"
            logoSrc={teloneLogo}
            gradient="bg-gradient-to-r from-sky-400 to-sky-500"
          />
          <ServiceCard
            id="econet-smartbiz"
            title="Econet SmartBiz"
            description="Purchase unlimited Econet smartbiz data"
            logoSrc={smartbizLogo}
            gradient="bg-gradient-to-r from-blue-500 to-purple-600"
          />
          <ServiceCard
            id="zesa-electricity"
            title="ZESA Electricity"
            description="Buy prepaid electricity tokens"
            logoSrc={zesaLogo}
            gradient="bg-gradient-to-r from-yellow-400 to-yellow-500"
          />
          <ServiceCard
            id="nyaradzo-policy"
            title="Nyaradzo Policy"
            description="Pay your life assurance policy premiums"
            logoSrc={nyaradzoLogo}
            gradient="bg-gradient-to-r from-blue-800 to-blue-900"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-center">
        <p className="text-gray-500 text-sm mb-4">
          Secure payments • 24/7 service • Instant processing
        </p>
        <Link
          to="/support"
          className="p-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
        >
          <MessageCircle size={16} />
          Need help? Contact Support
        </Link>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <PaymentProvider>
      <MainContent />
    </PaymentProvider>
  );
};

export default Index;