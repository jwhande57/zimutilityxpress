import React from "react";
import { usePayment } from "../contexts/PaymentContext";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  logoSrc: string;
  gradient: string;
  badge?: string;
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
    <div className="relative bg-white rounded-2xl shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 max-w-sm mx-auto sm:max-w-md md:max-w-lg w-full group">
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm transition-all duration-300 group-hover:bg-indigo-200">
          {badge}
        </span>
      )}

      {/* Card Content */}
      <div className="flex flex-col items-center sm:items-start gap-4">
        {/* Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <img
            src={logoSrc}
            alt={`${title} logo`}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base md:text-base leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSelectService}
        className={`
          mt-6 w-full py-3 px-6 rounded-xl text-white font-semibold text-sm sm:text-base 
          transition-all duration-300 hover:shadow-xl hover:scale-[1.02] 
          flex items-center justify-center gap-2 group/button
          ${gradient} bg-opacity-90 hover:bg-opacity-100
        `}
      >
        Get Started
        <span className="transition-transform duration-300 group-hover/button:translate-x-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ServiceCard;