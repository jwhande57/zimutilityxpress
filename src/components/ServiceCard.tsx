
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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      <button
        onClick={handleSelectService}
        className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-all duration-300 ${gradient} hover:shadow-lg hover:scale-102 flex items-center justify-center gap-2 group`}
      >
        Get Started
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
};

export default ServiceCard;
