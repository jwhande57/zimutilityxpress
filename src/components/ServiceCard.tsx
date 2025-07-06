
import React from 'react';
import { usePayment } from '../contexts/PaymentContext';

/**
 * ServiceCard Props Interface
 * Defines the properties for individual service selection cards
 */
interface ServiceCardProps {
  id: string;                    // Unique service identifier
  title: string;                 // Service display name
  description: string;           // Service description text
  icon: React.ReactNode;         // Icon component to display
  gradient: string;              // CSS gradient classes for styling
}

/**
 * ServiceCard Component
 * Displays a clickable card for each available service (Econet, NetOne, ZESA, etc.)
 * Handles service selection and triggers navigation to service-specific forms
 * 
 * @param id - Unique identifier for the service (used in routing)
 * @param title - Display name of the service
 * @param description - Brief description of what the service does
 * @param icon - React component/element to display as service icon
 * @param gradient - Tailwind CSS gradient classes for card styling
 */
const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id, 
  title, 
  description, 
  icon, 
  gradient 
}) => {
  // Get dispatch function from payment context to trigger service selection
  const { dispatch } = usePayment();

  /**
   * Handle service selection click
   * Updates global state to show the selected service form
   */
  const handleSelectService = () => {
    // Dispatch action to select this service (triggers form display)
    dispatch({ type: 'SELECT_SERVICE', payload: id });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Service Icon */}
      <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
        {icon}
      </div>
      
      {/* Service Information */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      
      {/* Action Button */}
      <button
        onClick={handleSelectService}
        className={`
          w-full py-3 px-6 rounded-xl text-white font-medium 
          transition-all duration-300 hover:shadow-lg hover:scale-102 
          flex items-center justify-center gap-2 group
          ${gradient}
        `}
      >
        Get Started
        {/* Animated Arrow Icon */}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
};

export default ServiceCard;
