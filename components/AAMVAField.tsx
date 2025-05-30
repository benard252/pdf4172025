import React from 'react';
import { AAMVAFieldDefinition } from '../types';
import { HelpCircle } from 'lucide-react';

interface AAMVAFieldProps {
  definition: AAMVAFieldDefinition;
  value: string;
  onChange: (id: string, value: string) => void;
  error?: string;
}

export const AAMVAField: React.FC<AAMVAFieldProps> = ({ definition, value, onChange, error }) => {
  const { id, label, type = 'text', placeholder, required, maxLength, pattern, options, tooltip, note } = definition;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(String(id), e.target.value); // Cast id to string
  };

  const commonProps = {
    id: String(id), // Cast id to string
    name: String(id), // Cast id to string
    value,
    onChange: handleChange,
    placeholder,
    required,
    maxLength,
    pattern,
    className: `mt-1 block w-full px-3 py-2 bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white disabled:bg-gray-600 disabled:text-gray-400`,
  };

  return (
    <div className="mb-4">
      <label htmlFor={String(id)} className="block text-sm font-medium text-gray-300 mb-1"> {/* Cast id to string */}
        {label} {required && <span className="text-red-400">*</span>}
        {tooltip && (
          <span className="ml-1 group relative inline-block">
            <HelpCircle size={14} className="text-gray-400 cursor-help" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-normal">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      
      {type === 'select' && options ? (
        <select {...commonProps}>
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input type={type} {...commonProps} />
      )}
      {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};