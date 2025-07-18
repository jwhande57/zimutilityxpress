import React from "react";
import { usePayment } from "../contexts/PaymentContext";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  logoSrc: string;
  gradient: string;
  badge?: string; // <-- Optional badge text
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  logoSrc,
  gradient,
  badge,
}) => {
  const { dispatch } = usePayment();

  const handleSelectService = () => {
    dispatch({ type: "SELECT_SERVICE", payload: id });
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Badge */}
      {badge && (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs sm:text-sm px-2 py-0.5 rounded-full shadow-sm">
          {badge}
        </span>
      )}
      <div className="flex justify-center sm:justify-start mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center overflow-hidden">
          <img
            src={logoSrc}
            alt={`${title} logo`}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
          />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {/* Button */}
      <button
        onClick={handleSelectService}
        className={`
          w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-white font-medium 
          transition-all duration-300 hover:shadow-lg hover:scale-[1.01] 
          flex items-center justify-center gap-2 group
          ${gradient}
        `}
      >
        Get Started
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
};

export default ServiceCard;
