
import React, { useState, useMemo } from 'react';
import { AAMVAData, AAMVAFieldDefinition } from '../types';
import { AAMVA_FIELDS } from '../constants';
import { AAMVAField } from './AAMVAField';
import { AlertTriangle } from 'lucide-react';

interface BarcodeFormProps {
  onSubmit: (data: AAMVAData) => void;
  initialData?: Partial<AAMVAData>;
  isLoading: boolean;
}

export const BarcodeForm: React.FC<BarcodeFormProps> = ({ onSubmit, initialData = {}, isLoading }) => {
  const [formData, setFormData] = useState<Partial<AAMVAData>>({
    IIN: '636055', // Default IIN from example
    AAMVAVersion: '09', // Default AAMVA version
    JurisdictionVersion: '01', // Default Jurisdiction version
    DCG: 'USA', // Default country
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' })); // Clear error on change
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    AAMVA_FIELDS.forEach(fieldDef => {
      const value = formData[fieldDef.id as keyof AAMVAData];
      if (fieldDef.required && (!value || String(value).trim() === '')) {
        newErrors[fieldDef.id] = `${fieldDef.label} is required.`;
        isValid = false;
      }
      if (value && fieldDef.maxLength && String(value).length > fieldDef.maxLength) {
        newErrors[fieldDef.id] = `${fieldDef.label} cannot exceed ${fieldDef.maxLength} characters.`;
        isValid = false;
      }
      if (value && fieldDef.pattern) {
        const regex = new RegExp(fieldDef.pattern);
        if (!regex.test(String(value))) {
          newErrors[fieldDef.id] = `${fieldDef.label} has an invalid format. ${fieldDef.tooltip || ''}`;
          isValid = false;
        }
      }
      // Specific date validation (ensure YYYY-MM-DD format from date picker)
      if (fieldDef.type === 'date' && value) {
         if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
            newErrors[fieldDef.id] = `${fieldDef.label} must be a valid date.`;
            isValid = false;
         }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as AAMVAData); // Cast as AAMVAData, assuming validation catches missing requireds
    } else {
      // Scroll to first error or show general message
      const firstErrorKey = Object.keys(errors).find(key => errors[key]);
      if (firstErrorKey) {
        const element = document.getElementById(firstErrorKey);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      alert("Please correct the errors in the form.");
    }
  };
  
  const groupedFields = useMemo(() => {
    return AAMVA_FIELDS.reduce((acc, field) => {
      if (!acc[field.group]) {
        acc[field.group] = [];
      }
      acc[field.group].push(field);
      return acc;
    }, {} as Record<string, AAMVAFieldDefinition[]>);
  }, []);


  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
      {Object.entries(groupedFields).map(([groupName, fields]) => (
        <div key={groupName} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
          <h3 className="text-xl font-semibold text-teal-400 mb-4">{groupName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {fields.map(fieldDef => (
              <AAMVAField
                key={fieldDef.id}
                definition={fieldDef}
                value={String(formData[fieldDef.id as keyof AAMVAData] || '')}
                onChange={handleChange}
                error={errors[fieldDef.id]}
              />
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(errors).length > 0 && (
         <div className="my-4 p-4 bg-red-900 border border-red-700 rounded-md text-red-200">
            <div className="flex items-center mb-2">
                <AlertTriangle size={20} className="mr-2 text-red-400"/>
                <h4 className="font-semibold">Please correct the following errors:</h4>
            </div>
            <ul className="list-disc list-inside text-sm">
                {Object.entries(errors).map(([key, message]) => (
                    <li key={key}>{AAMVA_FIELDS.find(f => f.id === key)?.label || key}: {message}</li>
                ))}
            </ul>
        </div>
      )}

      <div className="mt-8 pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500 text-white font-semibold py-3 px-8 rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
          >
            {isLoading ? 'Generating...' : 'Generate Barcode'}
          </button>
        </div>
      </div>
    </form>
  );
};
