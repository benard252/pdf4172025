
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBalance } from '../hooks/useBalance';
import { TopUpModal } from '../components/TopUpModal';
import { Spinner } from '../components/Spinner';
import { DollarSign, Edit3, PlusCircle, User } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const auth = useAuth();
  const balanceContext = useBalance();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  if (auth.isLoading || balanceContext.isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (!auth.user) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return <p className="text-center text-red-400">Please log in to view the dashboard.</p>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-teal-400 mb-2">Welcome, {auth.user.email}!</h1>
        <p className="text-lg text-gray-300">Manage your account and generate barcodes.</p>
      </header>

      <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Balance</h2>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
              ${balanceContext.balance.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
          >
            <PlusCircle size={20} className="mr-2" /> Top Up Balance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/generate" 
          className="group bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 flex flex-col items-center text-center"
        >
          <Edit3 size={48} className="mb-4 text-teal-400 group-hover:text-teal-300 transition-colors" />
          <h3 className="text-xl font-semibold text-white mb-2">Generate New Barcode</h3>
          <p className="text-gray-400 text-sm mb-3">
            Input AAMVA data to create a PDF417 barcode. Costs $5.00 per generation.
          </p>
          <span className="text-teal-400 group-hover:text-teal-300 font-medium transition-colors">
            Go to Generator &rarr;
          </span>
        </Link>
        
        <div className="group bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <User size={48} className="mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <h3 className="text-xl font-semibold text-white mb-2">Account Details</h3>
          <p className="text-gray-400 text-sm mb-3">
            User: {auth.user.email}
          </p>
          <span className="text-blue-400 group-hover:text-blue-300 font-medium transition-colors">
            More settings soon...
          </span>
        </div>
      </div>

      <TopUpModal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} />
    </div>
  );
};
