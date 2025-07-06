
import React from 'react';
import { usePayment } from '../contexts/PaymentContext';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id, 
  title, 
  description, 
  icon, 
  gradient 
}) => {
  const { dispatch } = usePayment();

  const handleSelectService = () => {
    dispatch({ type: 'SELECT_SERVICE', payload: id });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 transition-transform hover:scale-105">
      <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={handleSelectService}
        className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-all ${gradient} hover:shadow-lg flex items-center justify-center gap-2`}
      >
        Get Started
        <span>→</span>
      </button>
    </div>
  );
};

export default ServiceCard;
