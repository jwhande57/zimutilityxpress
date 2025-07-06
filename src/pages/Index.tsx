
import React from 'react';
import { PaymentProvider, usePayment } from '../contexts/PaymentContext';
import ServiceCard from '../components/ServiceCard';
import EconetAirtime from '../components/services/EconetAirtime';
import NetOneAirtime from '../components/services/NetOneAirtime';
import EconetData from '../components/services/EconetData';
import ZESAElectricity from '../components/services/ZESAElectricity';
import TelOneBroadband from '../components/services/TelOneBroadband';
import NyaradzoPolicy from '../components/services/NyaradzoPolicy';

const MainContent: React.FC = () => {
  const { state } = usePayment();

  const renderSelectedService = () => {
    switch (state.selectedService) {
      case 'econet-airtime':
        return <EconetAirtime />;
      case 'netone-airtime':
        return <NetOneAirtime />;
      case 'econet-data':
        return <EconetData />;
      case 'zesa-electricity':
        return <ZESAElectricity />;
      case 'telone-broadband':
        return <TelOneBroadband />;
      case 'nyaradzo-policy':
        return <NyaradzoPolicy />;
      default:
        return null;
    }
  };

  if (state.selectedService) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          {renderSelectedService()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Zim Mobile Payments
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Top up, pay bills, and purchase services instantly
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-4">
          <ServiceCard
            id="econet-airtime"
            title="Econet Airtime"
            description="Top up your Econet mobile line instantly"
            icon={<span className="text-white text-xl font-bold">E</span>}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          
          <ServiceCard
            id="netone-airtime"
            title="NetOne Airtime"
            description="Top up your NetOne mobile line instantly"
            icon={<span className="text-white text-xl font-bold">N</span>}
            gradient="bg-gradient-to-r from-red-500 to-red-600"
          />
          
          <ServiceCard
            id="econet-data"
            title="Econet Data Bundles"
            description="Purchase data, voice, SMS and WhatsApp bundles"
            icon={<span className="text-white text-xl">📱</span>}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          
          <ServiceCard
            id="zesa-electricity"
            title="ZESA Electricity"
            description="Buy prepaid electricity tokens"
            icon={<span className="text-white text-xl">⚡</span>}
            gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          
          <ServiceCard
            id="telone-broadband"
            title="TelOne Broadband"
            description="Purchase TelOne internet packages"
            icon={<span className="text-white text-xl">🌐</span>}
            gradient="bg-gradient-to-r from-green-500 to-green-600"
          />
          
          <ServiceCard
            id="nyaradzo-policy"
            title="Nyaradzo Policy"
            description="Pay your life assurance policy premiums"
            icon={<span className="text-white text-xl">🛡️</span>}
            gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto px-4 pb-8 text-center">
        <p className="text-gray-500 text-sm">
          Secure payments • 24/7 service • Instant processing
        </p>
      </div>
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
