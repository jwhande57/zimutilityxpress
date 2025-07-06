
import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

/**
 * FormField Props Interface
 * Defines the properties for a reusable form input component
 * Integrates with react-hook-form for validation and state management
 */
interface FormFieldProps {
  label: string;                          // Display label for the input field
  name: string;                           // Field name for form registration
  type?: string;                          // HTML input type (default: 'text')
  placeholder?: string;                   // Placeholder text for the input
  register: UseFormRegister<any>;         // React Hook Form register function
  error?: FieldError;                     // Validation error object
  validation?: Record<string, any>;       // Validation rules object
  children?: React.ReactNode;             // Custom input element (overrides default input)
}

/**
 * FormField Component
 * A reusable form field wrapper that handles labels, inputs, and error display
 * Integrates with react-hook-form for consistent form handling across the app
 * 
 * @param label - Text label displayed above the input
 * @param name - Field name used for form registration and validation
 * @param type - HTML input type (text, email, tel, number, etc.)
 * @param placeholder - Hint text shown in empty input
 * @param register - React Hook Form register function for field management
 * @param error - Validation error to display below input
 * @param validation - Validation rules (required, pattern, min, max, etc.)
 * @param children - Custom input component (e.g., select, textarea)
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  validation = {},
  children
}) => {
  return (
    <div className="mb-4">
      {/* Field Label */}
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      
      {/* Input Field - Either custom children or default input */}
      {children ? (
        /* Render custom input component (select, textarea, etc.) */
        children
      ) : (
        /* Render default text input */
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}  // Register field with validation rules
          className={`
            w-full px-4 py-3 border rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
      )}
      
      {/* Error Message Display */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;
