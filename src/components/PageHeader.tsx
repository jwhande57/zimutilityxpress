
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showFlag?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  showBack = true, 
  showFlag = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          )}
          {showFlag && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇿🇼</span>
              <span className="text-sm text-gray-600">Zimbabwe</span>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-center mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
