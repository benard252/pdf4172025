
import React, { useState }  from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Changed to named import QRCodeCanvas
import { CRYPTO_CURRENCIES, BARCODE_COST } from '../constants';
import { CryptoCurrency } from '../types';
import { useBalance } from '../hooks/useBalance';
import { Modal } from './Modal';
import { Copy, CheckCircle } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>(CRYPTO_CURRENCIES[0]);
  const [topUpAmountUSD, setTopUpAmountUSD] = useState<number>(BARCODE_COST); // Default to one barcode cost
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { addFunds } = useBalance();

  const handleCurrencyChange = (symbol: string) => {
    const currency = CRYPTO_CURRENCIES.find(c => c.symbol === symbol);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const amountInCrypto = topUpAmountUSD / selectedCurrency.rateToUSD;

  const handleConfirmPayment = () => {
    addFunds(topUpAmountUSD);
    alert(`Successfully added $${topUpAmountUSD.toFixed(2)} to your balance (mock payment).`);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy address. Please copy manually.');
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Balance">
      <div className="space-y-6">
        <div>
          <label htmlFor="topUpAmount" className="block text-sm font-medium text-gray-300">
            Amount to Top Up (USD)
          </label>
          <input
            type="number"
            id="topUpAmount"
            value={topUpAmountUSD}
            onChange={(e) => setTopUpAmountUSD(Math.max(1, parseFloat(e.target.value)))} // Min $1
            min="1"
            step="1"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
          />
        </div>

        <div>
          <label htmlFor="currencySelect" className="block text-sm font-medium text-gray-300">
            Select Cryptocurrency
          </label>
          <select
            id="currencySelect"
            value={selectedCurrency.symbol}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
          >
            {CRYPTO_CURRENCIES.map(crypto => (
              <option key={crypto.symbol} value={crypto.symbol}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-400">Please send approximately:</p>
          <p className="text-xl font-semibold text-teal-400">
            {amountInCrypto.toFixed(8)} {selectedCurrency.symbol}
          </p>
          <p className="text-xs text-gray-500">(~${topUpAmountUSD.toFixed(2)} USD)</p>
          
          <div className="my-4 flex justify-center">
            <QRCodeCanvas // Changed tag to QRCodeCanvas and removed renderAs
              value={selectedCurrency.qrData || selectedCurrency.address} 
              size={160} 
              level="H"
              bgColor="#2D3748" // bg-gray-700
              fgColor="#4FD1C5" // text-teal-400
              className="border-4 border-gray-600 rounded-md"
            />
          </div>
          
          <p className="text-sm text-gray-400 mt-2">To the address:</p>
          <div className="flex items-center justify-center mt-1">
            <p className="text-sm font-mono break-all bg-gray-800 p-2 rounded-md text-teal-300">
              {selectedCurrency.address}
            </p>
            <button 
              onClick={() => copyToClipboard(selectedCurrency.address)}
              className="ml-2 p-2 bg-gray-600 hover:bg-gray-500 rounded-md text-gray-300 hover:text-white transition-colors"
              title="Copy address"
            >
              {copiedAddress === selectedCurrency.address ? <CheckCircle size={18} className="text-green-400"/> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">This is a mock payment. No real transaction will occur.</p>
        </div>

        <button
          onClick={handleConfirmPayment}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
        >
          Confirm Mock Payment ($${topUpAmountUSD.toFixed(2)})
        </button>
      </div>
    </Modal>
  );
};
