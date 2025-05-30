
import React, { useState } from 'react';
import { BarcodeForm } from '../components/BarcodeForm';
import { BarcodeDisplay } from '../components/BarcodeDisplay';
import { AAMVAData } from '../types';
import { useBalance } from '../hooks/useBalance';
import { BARCODE_COST } from '../constants';
import { formatAAMVADataToString } from '../services/aamvaService';
import { Spinner } from '../components/Spinner';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const GenerateBarcodePage: React.FC = () => {
  const [generatedBarcodeData, setGeneratedBarcodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const balance = useBalance();

  const handleFormSubmit = async (data: AAMVAData) => {
    setError(null);
    setSuccessMessage(null);
    setGeneratedBarcodeData(null);

    if (balance.balance < BARCODE_COST) {
      setError(`Insufficient balance. You need $${BARCODE_COST.toFixed(2)} to generate a barcode. Please top up.`);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate some processing delay if needed
      // await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const barcodeString = formatAAMVADataToString(data);
      
      // Attempt to deduct funds first. If successful, proceed.
      const deductionSuccessful = balance.deductFunds(BARCODE_COST);
      if (deductionSuccessful) {
        setGeneratedBarcodeData(barcodeString);
        setSuccessMessage(`Barcode generated successfully! $${BARCODE_COST.toFixed(2)} deducted from your balance.`);
      } else {
        // This should ideally not happen if initial check passes, but as a safeguard:
        setError('Failed to deduct funds. Please try again or check your balance.');
      }
    } catch (e: any) {
      console.error("Error formatting AAMVA data:", e);
      setError(`Error generating barcode: ${e.message || 'Unknown error'}. Please check your input data.`);
      // If formatting fails, funds should ideally not be deducted, or a refund mechanism needed.
      // For this demo, deduction happens only on successful string generation.
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBarcodeGenerationError = (err: Error) => {
    setError(`PDF417 library error: ${err.message}. The AAMVA data might be malformed or too long.`);
    // Consider refunding if funds were already deducted and bwip-js fails.
    // For now, error is shown, user needs to verify data.
    setGeneratedBarcodeData(null); // Clear previous attempts
  };


  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-teal-400">Generate AAMVA PDF417 Barcode</h1>
        <p className="text-lg text-gray-300 mt-2">
          Fill in the details below. Generating a barcode costs ${BARCODE_COST.toFixed(2)}. 
          Current balance: <span className="font-semibold text-green-400">${balance.balance.toFixed(2)}</span>
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-800 border border-red-600 rounded-md text-red-200 flex items-start">
          <AlertTriangle size={24} className="mr-3 mt-1 text-red-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Generation Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      {successMessage && !error && ( // Show success only if no superseding error
        <div className="mb-6 p-4 bg-green-800 border border-green-600 rounded-md text-green-200 flex items-start">
          <CheckCircle size={24} className="mr-3 mt-1 text-green-400 flex-shrink-0" />
           <div>
            <h4 className="font-semibold">Success!</h4>
            <p className="text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      <BarcodeForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && !generatedBarcodeData && ( // Show spinner only when loading and no data yet
        <div className="mt-8 flex flex-col items-center">
          <Spinner size="lg" />
          <p className="mt-2 text-gray-400">Generating barcode...</p>
        </div>
      )}

      {generatedBarcodeData && !error && ( // Show barcode display only if data is present and no critical error
        <BarcodeDisplay data={generatedBarcodeData} onGenerationError={handleBarcodeGenerationError} />
      )}
    </div>
  );
};
